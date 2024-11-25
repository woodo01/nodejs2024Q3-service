import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './auth/jwt.guard';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(
    new (class extends JwtGuard {
      canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { url } = request;
        if (url === '/' || url.startsWith('/auth/') || url.startsWith('/doc')) {
          return true;
        }
        return super.canActivate(context);
      }
    })(),
  );
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
