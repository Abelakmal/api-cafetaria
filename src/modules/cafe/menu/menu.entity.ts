import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cafe } from '../cafe.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'float',
  })
  price: number;

  @Column({
    name: 'is_recomendation',
    default: false,
  })
  isRecomendation: boolean;

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

  @ManyToOne(() => Cafe, (cafe) => cafe.menus)
  cafe: Cafe;
}
