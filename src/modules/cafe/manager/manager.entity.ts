import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cafe } from '../cafe.entity';
import { User } from 'src/modules/user/user.entity';

@Entity({
  name: 'managers',
})
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cafe, (cafe) => cafe.menus, { nullable: false })
  cafe: Cafe;

  @ManyToOne(() => User, (user) => user.managedCafes, { nullable: false })
  user: User;
}
