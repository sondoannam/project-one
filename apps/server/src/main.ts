import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS to allow requests from your frontend
  app.enableCors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    origin: true,
    credentials: true,
  });

  // Use the PORT env variable or default to 8080
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
