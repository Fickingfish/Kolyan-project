import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[DEBUG] process.env.PORT:', process.env.PORT);

  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();    
