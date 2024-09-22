import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ResponsePagination } from 'src/common/types/response-pagination.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Payload } from '../auth/auth.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  public async getUsers(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ResponsePagination<User>> {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: pageSize,
    });
    return { total, skip, limit: pageSize, data };
  }

  public async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      username,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async create(
    createUserDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    const isExist = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (isExist) {
      throw new BadRequestException('User is already Exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    if (entityManager) {
      return await entityManager.save(user);
    } else {
      return await this.userRepository.save(user);
    }
  }

  public async update(
    updateUserDto: Partial<UpdateUserDto>,
    id: number,
    current: Payload,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id,
      isDelete: false,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (current.username !== user.username && current.role !== 'superadmin') {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new BadRequestException('Username already taken');
      }
      user.username = updateUserDto.username;
    }

    if (updateUserDto.fullname) {
      user.fullname = updateUserDto.fullname;
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    user.updatedAt = new Date();

    return await this.userRepository.save(user);
  }

  public async delete(id: number, current: Payload): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id,
      isDelete: false,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (current.username !== user.username && current.role !== 'superadmin') {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    user.isDelete = true;
    await this.userRepository.save(user);
  }
}
