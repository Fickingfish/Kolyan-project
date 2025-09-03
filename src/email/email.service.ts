import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const confirmationUrl = `${frontendUrl}/confirm-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your email',
      template: 'confirm-email',
      context: {
        confirmationUrl,
        email,
      },
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to our platform!',
      template: 'welcome',
      context: {
        firstName,
        email,
      },
    });
  }
}