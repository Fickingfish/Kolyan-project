import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { ConfirmationToken } from '../users/entities/confirmation-token.entity';

function parseJwtExpiresIn(expiresIn: string): number {
  if (!expiresIn) return 900;

  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1), 10);

  if (isNaN(value)) return 900;

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return 900;
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ConfirmationToken)
    private confirmationTokensRepository: Repository<ConfirmationToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      email,
      password,
      firstName,
      lastName,
      isEmailConfirmed: false,
      isActive: false,
    });

    await this.usersRepository.save(user);

    const confirmationCode = await this.createConfirmationCode(user);
    await this.emailService.sendConfirmationEmail(email, confirmationCode.code);

    return {
      message: 'Registration successful. Please check your email for confirmation instructions.',
    };
  }

  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async createConfirmationCode(user: User): Promise<ConfirmationToken> {
    const code = this.generateSixDigitCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const confirmationToken = this.confirmationTokensRepository.create({
      code,
      email: user.email,
      expiresAt,
      userId: user.id,
    });

    return await this.confirmationTokensRepository.save(confirmationToken);
  }

  async confirmEmail(code: string): Promise<TokensDto> {
    const email = await this.validateConfirmationCode(code);

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    user.isEmailConfirmed = true;
    user.isActive = true;
    await this.usersRepository.save(user);

    await this.emailService.sendWelcomeEmail(user.email, user.firstName);

    return this.generateTokens(user);
  }

  private async validateConfirmationCode(code: string): Promise<string> {
    const confirmationToken = await this.confirmationTokensRepository.findOne({
      where: { code },
      relations: ['user'],
    });

    if (!confirmationToken) {
      throw new BadRequestException('Invalid confirmation code');
    }

    if (!confirmationToken.isValid()) {
      await this.confirmationTokensRepository.remove(confirmationToken);
      throw new BadRequestException('Confirmation code has expired');
    }

    await this.confirmationTokensRepository.remove(confirmationToken);
    return confirmationToken.email;
  }

  async login(loginDto: LoginDto): Promise<TokensDto> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException('Please confirm your email first');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return this.generateTokens(user);
  }

  async resendConfirmationCode(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.confirmationTokensRepository.delete({ email });

    const confirmationCode = await this.createConfirmationCode(user);
    await this.emailService.sendConfirmationEmail(email, confirmationCode.code);

    return { message: 'Confirmation code sent successfully' };
  }

  async refreshToken(userId: string): Promise<TokensDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return this.generateTokens(user);
  }

  private generateTokens(user: User): TokensDto {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessTokenExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
    const refreshTokenExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const accessToken = this.jwtService.sign(payload, { expiresIn: accessTokenExpiresIn });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshTokenExpiresIn });

    const expiresIn = parseJwtExpiresIn(accessTokenExpiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private generateConfirmationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new Error('User not found or inactive');
    }

    return user;
  }
}
