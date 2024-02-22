import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger/';

const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors({
  //   origin: (process.env.CORS_ORIGIN || '').split(';'),
  // });

  const config = new DocumentBuilder()
    .setTitle('Taew API')
    .setDescription("The instant messaging platform that doesn't like y-1")
    .setVersion('1.0')
    .addBearerAuth({
      description: `Please put your JWT Token here`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowed headers
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    // headers exposed to the client
    exposedHeaders: ['Authorization'],
    credentials: true,
  });
  await app.listen(HTTP_PORT);
}

bootstrap();
