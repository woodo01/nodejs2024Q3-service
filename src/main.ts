import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup(
    'doc',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Home Library Service API')
        .setDescription('API documentation for Home Library Service')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    ),
  );
  await app.listen(app.get(ConfigService).get<number>('PORT') || 4000);
}
bootstrap();
