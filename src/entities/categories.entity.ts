import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Unique,
  RelationId,
  OneToMany,
} from 'typeorm';
import { SubCategory } from './sub-categories.entity';

@Entity('categories')
@Unique('unique_category_name', ['name'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ nullable: true, type: 'text' })
  image_url: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => SubCategory, subCat => subCat.category)
  subCategories: SubCategory[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
