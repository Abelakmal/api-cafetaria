import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cafe } from '../cafe/cafe.entity';
import { Exclude } from 'class-transformer';
import { Manager } from '../cafe/manager/manager.entity';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  OWNER = 'owner',
  MANAGER = 'manager',
}

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  fullname: string;

  @Column({
    length: 100,
    unique: true,
  })
  @Exclude()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    default: false,
    name: 'is_delete',
  })
  @Exclude()
  isDelete: boolean;

  @Column({ nullable: true, name: 'delete_at' })
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => Cafe, (cafe) => cafe.owner)
  cafes: Cafe[];

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  @Exclude()
  role: UserRole;

  @Column({ name: 'created_at', default: new Date() })
  @Exclude()
  createdAt: Date;

  @Column({ name: 'updated_at', default: new Date() })
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => Manager, (manager) => manager.user)
  managedCafes: Manager[];
}
