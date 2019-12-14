import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { until } from 'src/utils/helpers';
import { FileInterceptor } from '@nestjs/platform-express';
import { promisify } from 'util';
import { rename } from 'fs';
import { join as joinPath } from 'path';
import { diskStorage } from 'multer';
@Controller('file-upload')
export class FileUploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads', //with respect to root directory
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          cb(null, './uploads');
        }, //'../../uploads',
        filename: function(req, file, cb) {
          cb(
            null,
            Date.now() + '-' + file.originalname.replace(/[^.-_\/\w]/g, '_'),
          );
        },
      }),
    }),
  )
  async handleFileUpload(@UploadedFile() file) {
    // const [err,saved] = await until()

    if (!file) throw new InternalServerErrorException('Please select an Image');
    //save file
    // console.log(file);
    if (!file.mimetype.includes('image')) {
      return new HttpException(
        { error: 'Please input a proper image' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (file.size) {
      const fileUri = '/uploads/' + file.filename;

      return { success: true, data: fileUri };
    }
  }
}
