import {
  Controller,
  Get,
  Body,
  InternalServerErrorException,
  Post,
  HttpException,
  HttpStatus,
  Query,
  Delete,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDto, UpdateCategoryDto } from './category.dto';
import { until } from '../utils/helpers';
import { errorLog } from '../utils/logger';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addCategory(@Body() details: AddCategoryDto, @Req() req) {
    console.log(req);
    const [err, catId] = await until(this.categoryService.addCategory(details));
    console.log(err, catId);
    if (err) {
      errorLog.error(err);
      if (err.code == 'ER_DUP_ENTRY') {
        if (err.sqlMessage.includes('unique_category_name')) {
          throw new HttpException(
            { message: 'A Category with same title already exists.' },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new InternalServerErrorException(
        'An Error occured while saving the category.',
      );
    }
    return { success: true, data: catId };
  }

  @Get('all')
  async getAllCategories(@Query() filters) {
    const isCountRequired = filters.count == 'yes';
    const [err, categories] = await until(
      this.categoryService.getCategories({ ...filters, isCountRequired }),
    );
    if (err) {
      errorLog.error(err);
      throw new InternalServerErrorException(
        'An Error occured while fetching categories',
      );
    }
    return {
      success: true,
      data: isCountRequired ? categories[0] : categories,
      total: isCountRequired ? categories[1] : undefined,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove/:id')
  async removeCategories(@Param('id') catId: number) {
    const [err, rowsDeleted] = await until(
      this.categoryService.removeCategory(catId),
    );
    if (err) {
      errorLog.error(err);
      if (err.code == 'ER_ROW_IS_REFERENCED_2') {
        if (err.sqlMessage.includes('company_category_mapping')) {
          throw new HttpException(
            {
              message:
                'Companies with this category exists, please remove this category from them and try again.',
            },
            HttpStatus.CONFLICT,
          );
        }

        if (err.sqlMessage.includes('category_id')) {
          throw new HttpException(
            {
              message:
                'This category has sub-categories. Remove them before deleting the category',
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new InternalServerErrorException(
        'An Error occured while removing category',
      );
    }
    if (rowsDeleted === 0)
      throw new HttpException(
        { message: 'Given category doesnot exist or already deleted' },
        HttpStatus.CONFLICT,
      );
    return { success: !!rowsDeleted };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  async updateCategory(@Body() newDetails: UpdateCategoryDto) {
    const [err, affectedRows] = await until(
      this.categoryService.updateCategory(newDetails),
    );
    if (err) {
      errorLog.error(err);
      if (err.code == 'ER_DUP_ENTRY') {
        if (err.sqlMessage.includes('unique_category_name')) {
          throw new HttpException(
            { message: 'A Category with same title already exists.' },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new InternalServerErrorException(
        'An Error occured while updating the category',
      );
    }

    return { success: !!affectedRows };
  }
}
