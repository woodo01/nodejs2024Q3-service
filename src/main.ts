import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { JwtGuard } from './auth/jwt.guard';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { LogExceptionFilter } from './logging/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);
  app.useGlobalFilters(new LogExceptionFilter(loggingService));
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
  app.use((req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      loggingService.log(
        `${method} ${originalUrl} ${JSON.stringify(query)} ${JSON.stringify(
          body,
        )} - ${statusCode}`,
      );
    });
    next();
  });

  process.on('uncaughtException', (error) => {
    loggingService.error(`Uncaught Exception: ${error.message}`, error.stack);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggingService.error(
      `Unhandled Rejection at: ${promise} reason: ${reason}`,
    );
  });
}

bootstrap();
