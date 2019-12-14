import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { UserRole } from './user_roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column()
  password: string;

  @ManyToMany(_ => UserRole, userRole => userRole.users, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  userRoles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
