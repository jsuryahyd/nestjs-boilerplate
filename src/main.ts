import { config } from 'dotenv';
config(); //this line should be before `import {AppModule}`
import { errorLog } from './utils/logger';
errorLog.error = errorLog.error;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join as joinPath } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import * as helmet from 'helmet';

process.on('uncaughtException', err => {
  errorLog.error(err);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    credentials: true,
    origin: new RegExp(process.env.BASE_URL.split(':')[0]),
  });
  app.use(helmet());
  app.setGlobalPrefix('api');

  //serve files from uploads folder
  app.useStaticAssets(joinPath(__dirname, '../uploads'), {
    prefix: '/uploads',
    etag: false, //working
  });
  // app.useGlobalGuards([AuthGuard('jwt')])
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}
bootstrap();
