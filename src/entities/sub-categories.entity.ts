import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  Unique,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './categories.entity';


/**
 * todo :  set cascades.
 */
@Entity('sub_categories')
@Unique('no_dup_sub_category',['name','category'])
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50 })
  name: string;
  @ManyToOne(() => Category, cat => cat.subCategories)
  category: Category;

  @RelationId((subCat: SubCategory) => subCat.category)
  categoryId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt:Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt:Date;
  
}
