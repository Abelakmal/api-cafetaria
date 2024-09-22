import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Menu } from './menu/menu.entity';

@Entity({
  name: 'cafes',
})
export class Cafe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    default: false,
    name: 'is_delete',
  })
  isDelete: boolean;

  @Column({ nullable: true, name: 'delete_at' })
  deletedAt: Date;

  @Column({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @Column({ name: 'updated_at', default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.cafes)
  owner: User;

  @OneToMany(() => Menu, (menu) => menu.cafe)
  menus: Menu[];
}
