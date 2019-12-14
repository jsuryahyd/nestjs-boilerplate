import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm";
import { User } from "./users.entity";

@Entity('user_roles')
export class UserRole{
@PrimaryGeneratedColumn({type:"tinyint"})
id:number;

@Column()
title:string;

@ManyToMany(_=>User,user=>user.userRoles,{onDelete:"CASCADE",onUpdate:"CASCADE"})
@JoinTable({name:'user_role_mapping'})
users:User[]
}