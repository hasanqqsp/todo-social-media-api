import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Social Media Post Todo API')
    .setDescription('API untuk mengelola postingan sosial media')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error('Error during bootstrap:', err));
