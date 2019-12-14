import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { until } from '../utils/helpers';
import { HttpStatus } from '@nestjs/common';
import { Category } from '../entities/categories.entity';

describe('Category Controller', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add category', () => {
    it('should throw category alreay exists error on add failed', async done => {
      jest.spyOn(categoryService, 'addCategory').mockImplementation(() =>
        Promise.reject({
          sqlMessage: '- unique_category_name - ',
          code: 'ER_DUP_ENTRY',
        }),
      );
      const [err, res] = await until(
        controller.addCategory({ name: 'construction' }),
      );
      expect(err).toBeDefined();
      expect(err.status).toBe(HttpStatus.CONFLICT);
      expect(err.response.message).toBe(
        'A Category with same title already exists.',
      );
      expect(res).toBeUndefined();
      done();
    });

    it('should throw generic error on add failed', async done => {
      jest.spyOn(categoryService, 'addCategory').mockImplementation(() =>
        Promise.reject({
          sqlMessage: 'You have a syntax error near ...',
          code: 'ER_SYNTAX_ERROR',
        }),
      );
      const [err, res] = await until(
        controller.addCategory({ name: 'construction' }),
      );
      expect(err).toBeDefined();
      expect(err.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(err.response.message).toBe(
        'An Error occured while saving the category.',
      );
      expect(res).toBeUndefined();
      done();
    });

    it('should return categoryId on add success', async done => {
      jest
        .spyOn(categoryService, 'addCategory')
        .mockImplementation(() => Promise.resolve(1));
      const [err, res] = await until(
        controller.addCategory({ name: 'construction' }),
      );
      expect(err).toBeNull();
      // expect(res.status).toBe(HttpStatus.OK);res.status will be undefined
      expect(res).toMatchObject({ data: 1, success: true });
      done();
    });
  });

  describe('delete category', () => {
    it('should throw category doesnot exist error on remove failed', async done => {
      jest
        .spyOn(categoryService, 'removeCategory')
        .mockImplementation(() => Promise.resolve(0));
      const [err, res] = await until(controller.removeCategories(1));
      expect(err).toBeDefined();
      expect(err.status).toBe(HttpStatus.CONFLICT);
      expect(err.response.message).toBe(
        'Given category doesnot exist or already deleted',
      );
      expect(res).toBeUndefined();
      done();
    });

    it('should throw "companies with this category exist" error on remove failed', async done => {
      jest.spyOn(categoryService, 'removeCategory').mockImplementation(() =>
        Promise.reject({
          sqlMessage: '(:- company_category_mapping - :)', //string must contain `company_category_mapping`
          code: 'ER_ROW_IS_REFERENCED_2',
        }),
      );
      const [err, res] = await until(controller.removeCategories(1));
      expect(err).toBeDefined();
      expect(err.status).toBe(HttpStatus.CONFLICT);
      expect(err.response.message).toBe(
        'Companies with this category exists, please remove this category from them and try again.',
      );
      expect(res).toBeUndefined();
      done();
    });

    it('should throw generic error on remove failed', async done => {
      jest.spyOn(categoryService, 'removeCategory').mockImplementation(() =>
        Promise.reject({
          sqlMessage: 'You have a syntax error near ...',
          code: 'ER_SYNTAX_ERROR',
        }),
      );
      const [err, res] = await until(controller.removeCategories(2));
      expect(err).toBeDefined();
      expect(err.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(err.response.message).toBe(
        'An Error occured while removing category',
      );
      expect(res).toBeUndefined();
      done();
    });

    it('should return success on delete success', async done => {
      jest
        .spyOn(categoryService, 'removeCategory')
        .mockImplementation(() => Promise.resolve(1));
      const [err, res] = await until(controller.removeCategories(1));
      expect(err).toBeNull();
      expect(res).toMatchObject({ success: true });
      done();
    });
  });

  describe('edit category', () => {
    it('should send generic error on edit fail', async done => {
      jest
        .spyOn(categoryService, 'updateCategory')
        .mockImplementation(() => Promise.reject({ code: 'asldkfjsl' }));

      const [err, res] = await until(
        controller.updateCategory({ id: 1, name: 'good category' }),
      );
      expect(err).toBeDefined();
      expect(err.response.message).toBe(
        'An Error occured while updating the category',
      );
      expect(err.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res).toBeUndefined();
      done();
    });

    it('should send duplicate name error on edit fail', async done => {
      jest.spyOn(categoryService, 'updateCategory').mockImplementation(() =>
        Promise.reject({
          code: 'ER_DUP_ENTRY',
          sqlMessage: 'unique_category_name',
        }),
      );

      const [err, res] = await until(
        controller.updateCategory({ id: 1, name: 'good category' }),
      );
      expect(err).toBeDefined();
      expect(err.response.message).toBe(
        'A Category with same title already exists.',
      );
      expect(err.status).toBe(HttpStatus.CONFLICT);
      expect(res).toBeUndefined();
      done();
    });

    it('should return success on update success', async done => {
      jest
        .spyOn(categoryService, 'updateCategory')
        .mockImplementation(() => Promise.resolve(1));
      const [err, res] = await until(
        controller.updateCategory({ id: 1, name: 'sdlskdf' }),
      );
      expect(err).toBeNull();
      expect(res).toMatchObject({ success: true });
      done();
    });
  });

  fdescribe('fetch categories', () => {
    it('should throw internal_server_error on fetch fail', async done => {
      jest.spyOn(categoryService, 'getCategories').mockImplementation(() => {
        return Promise.reject({ code: 'er_syntax_err' });
      });
      const [err, res] = await until(
        controller.getAllCategories({ limit: 10, offset: 10 }),
      );
      expect(err).toBeDefined();
      expect(err.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(err.response.message).toBe(
        'An Error occured while fetching categories',
      );
      expect(res).toBeUndefined();
      done();
    });

    it('should send cats on fetch success', async done => {
      const categories = Array(10).fill(new Category());

      jest.spyOn(categoryService, 'getCategories').mockImplementation(() => {
        return Promise.resolve(categories);
      });
      const [err, res] = await until(
        controller.getAllCategories({ limit: 10, offset: 10,count:'no' }),
      );
      expect(err).toBeNull();

      expect(res).toMatchObject({ success: true, data: categories });
      done();
    });



    it('should send cats on fetch success and total if count required', async done => {
      const categories = Array(10).fill(new Category());

      jest.spyOn(categoryService, 'getCategories').mockImplementation(() => {
        return Promise.resolve([categories,10]);
      });
      const [err, res] = await until(
        controller.getAllCategories({ limit: 10, offset: 10,count:'yes' }),
      );
      expect(err).toBeNull();

      expect(res).toMatchObject({ success: true, data: categories,total:10 });
      done();
    });
  });
});
