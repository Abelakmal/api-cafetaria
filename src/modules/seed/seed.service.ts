import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const user = new User();
    user.fullname = 'admin';
    user.username = 'admin';
    user.password = await bcrypt.hash('admin123', 10);
    user.role = UserRole.SUPERADMIN;

    const existingUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (!existingUser) {
      await this.userRepository.save(user);
      Logger.log(`User ${user.username} created.`);
    }
  }
}
