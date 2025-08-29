import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokensDto> {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isEmailConfirmed: false,
    });

    await this.usersRepository.save(user);
    return this.generateTokens(user);
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

  async confirmEmail(confirmEmailDto: ConfirmEmailDto): Promise<void> {
    // In real app, validate the token properly
    const user = await this.usersRepository.findOne({ 
      where: { email: confirmEmailDto.email } 
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    user.isEmailConfirmed = true;
    await this.usersRepository.save(user);
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
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresIn: 900,
    };
  }

  async validateUser(userId: string): Promise<User> {
  const user = await this.usersRepository.findOne({ 
    where: { id: userId, isActive: true } 
  });
  
  if (!user) {
    throw new Error('User not found or inactive');
  }
  
  return user;
  }
}