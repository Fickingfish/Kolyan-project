import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your confirmation code',
      template: 'confirm-email',
      context: {
        code: code,
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

  async sendInvitationEmail(
  email: string, 
  projectName: string, 
  inviterName: string,
  acceptUrl: string,
  declineUrl: string,
  expiresAt: Date
): Promise<void> {
  await this.mailerService.sendMail({
    to: email,
    subject: `Invitation to project: ${projectName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Project Invitation</title>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              margin: 10px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 4px;
            }
            .button.decline {
              background-color: #dc2626;
            }
          </style>
      </head>
      <body>
        <div class="container">
          <h2>Project Invitation</h2>
          <p>Hello!</p>
          <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectName}"</strong>.</p>
          <p>This invitation will expire on: <strong>${expiresAt.toLocaleDateString()}</strong></p>
          
          <div style="margin: 30px 0;">
            <a href="${acceptUrl}" class="button">Accept Invitation</a>
            <a href="${declineUrl}" class="button decline">Decline</a>
          </div>
          
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      </body>
      </html>
    `,
    });
  }
} 