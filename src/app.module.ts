import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { EmailModule } from './email/email.module';
import { ConfirmationToken } from './users/entities/confirmation-token.entity';
import { KanbanModule } from './kanban/kanban.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST', 'localhost'),
          port: configService.get('SMTP_PORT', 1025),
          ignoreTLS: configService.get('SMTP_IGNORE_TLS') === true,
          secure: configService.get('SMTP_SECURE') === false,
        },
        defaults: {
          from: configService.get('EMAIL_FROM', '"No Reply" <noreply@example.com>'),
        },
        template: {
          dir: join(__dirname, 'email', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },  
      }),
      inject: [ConfigService],
    }),

    EmailModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('DB_LOGGING') === 'true',
        retryDelay: 3000,
        retryAttempts: 10,
      }),
    }),
    AuthModule,
    UsersModule,
    KanbanModule,
  ],
})
export class AppModule {}
