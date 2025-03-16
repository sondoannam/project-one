import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.getOrThrow('API_PREFIX'), {
    exclude: ['/'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Configure CORS to allow requests from your frontend
  app.enableCors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    origin: true,
    credentials: true,
  });

  const documentConfig = new DocumentBuilder()
    .setTitle('PRJ One documentation')
    .setDescription("This is PRJ One's APIs description")
    .setVersion('1.0')
    .addTag('PRJ One')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  // Use the PORT env variable or default to 8080
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
