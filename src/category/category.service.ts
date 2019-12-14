import { Injectable } from '@nestjs/common';
import { AddCategoryDto, UpdateCategoryDto } from './category.dto';
import { until } from '../utils/helpers';
import { getRepository, getConnection, FindManyOptions } from 'typeorm';
import { Category } from '../entities/categories.entity';

@Injectable()
export class CategoryService {
  async addCategory(details: AddCategoryDto) {
    const [err, result] = await until(
      getConnection()
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values([{ name: details.name }])
        .execute(),
    );
    if (err) throw err;
    return result.identifiers[0].id;
  }

  async getCategories(details) {
    //   let filters = {relations:["subCate"]}
    let filters: FindManyOptions = {
      relations: ['subCategories'],
      order: { createdAt: 'DESC' },
      // join: {
      //   alias: 'cat',
      //   leftJoinAndSelect: {
      //     subCategories: 'cat.subCategories',
      //   },
      // },
    };
    if (details.limit || details.offset != undefined) {
      filters = {
        where: {},
        skip: details.offset,
        take: details.limit,
      };
    }
    const [err, result] = await until(
      details.isCountRequired
        ? <any>getRepository(Category).findAndCount(filters)
        : getRepository(Category).find(filters),
    );
    if (err) throw err;
    return result;
  }

  async removeCategory(id: number): Promise<number> {
    const [err, result] = await until(getRepository(Category).delete(id));
    if (err) throw err;
    return result.affected;
  }

  async updateCategory(details: UpdateCategoryDto) {
    const [err, result] = await until(
      getConnection()
        .createQueryBuilder()
        .update(Category)
        .set(details)
        .where('id=:id', { id: details.id })
        .execute(),
    );
    if (err) throw err;
    return result.raw.changedRows || result.raw.affectedRows;
  }
}
