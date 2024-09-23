import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SeedService } from './modules/seed/seed.service';

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Cafetaria API Documentation')
    .setVersion('1.0')
    .setDescription('API requests are limited to 1 minute only 60 requests')
    .addServer(process.env.SERVER || 'http://localhost:8080')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(process.env.PORT || 8080);

  return app.getUrl();
}

void (async (): Promise<void> => {
  try {
    const url = await bootstrap();
    Logger.log(url, 'Bootstrap');
  } catch (error) {
    Logger.error(error, 'Bootstrap');
  }
})();
