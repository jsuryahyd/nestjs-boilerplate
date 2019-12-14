import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { FileUploadController } from './file-upload/file-upload.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '../..',
        'angular-frontend/dist/angular-frontend',
      ),//or wherever `/public` folder is
    }),
    TypeOrmModule.forRoot(),//config is automatically taken from `ormconfig.json`
    CategoryModule,
    AuthModule,

  ],
  controllers: [AppController, FileUploadController],
  providers: [AppService],
})
export class AppModule {}