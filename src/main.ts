import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Setup Swagger OpenAPI Document
  const config = new DocumentBuilder()
    .setTitle('NestJS Postgres & Redis (BullMQ) API')
    .setDescription('Arka plan iş kuyruğu ve veritabanı entegrasyonu sağlayan hazır NestJS API şablonu.')
    .setVersion('1.0')
    .addTag('Tasks', 'Görev yönetim ve arka plan işlem API uç noktaları')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📖 Swagger API documentation is available at: http://localhost:${port}/api-docs`);
}
bootstrap();
