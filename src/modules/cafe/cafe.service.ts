import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cafe } from './cafe.entity';
import { Repository } from 'typeorm';
import { ResponsePagination } from 'src/common/types/response-pagination.interface';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { Payload } from '../auth/auth.interface';
import { UserService } from '../user/user.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CafeService {
  constructor(
    @InjectRepository(Cafe)
    private cafeRepository: Repository<Cafe>,
    private userService: UserService,
  ) {}

  public async gets(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ResponsePagination<Cafe>> {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.cafeRepository
      .createQueryBuilder('cafe')
      .leftJoinAndSelect('cafe.owner', 'owner')
      .leftJoinAndSelect('cafe.menus', 'menus', 'menus.isDelete = false')
      .where('cafe.isDelete = false')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const exclude = plainToInstance(Cafe, data);

    return { total, skip, limit: pageSize, data: exclude };
  }

  public async getById(id: number): Promise<Cafe> {
    const cafe = await this.cafeRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
      relations: ['owner'],
    });

    if (!cafe) {
      throw new NotFoundException('Cafe not found');
    }

    return cafe;
  }

  public async create(cafe: Partial<Cafe>, current: Payload): Promise<void> {
    const isExist = await this.cafeRepository.findOne({
      where: {
        phoneNumber: cafe.phoneNumber,
        isDelete: false,
      },
    });

    if (isExist) {
      throw new BadRequestException('phone number already in use');
    }

    const user = await this.userService.findByUsername(current.username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    cafe.owner = user;
    await this.cafeRepository.save(cafe);
  }

  public async update(
    updateCafeDto: Partial<UpdateCafeDto>,
    id: number,
    current: Payload,
  ): Promise<Cafe> {
    const cafe = await this.cafeRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
      relations: ['owner'],
    });

    if (!cafe) {
      throw new NotFoundException('Cafe not found');
    }

    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    if (
      updateCafeDto.phoneNumber &&
      updateCafeDto.phoneNumber !== cafe.phoneNumber
    ) {
      const existingPhoneNumber = await this.cafeRepository.findOne({
        where: { phoneNumber: updateCafeDto.phoneNumber, isDelete: false },
      });
      if (existingPhoneNumber) {
        throw new BadRequestException('Phone Number already taken');
      }
      cafe.phoneNumber = updateCafeDto.phoneNumber;
    }

    if (updateCafeDto.address) {
      cafe.address = updateCafeDto.address;
    }

    if (updateCafeDto.name) {
      cafe.name = updateCafeDto.name;
    }

    cafe.updatedAt = new Date();

    const data = await this.cafeRepository.save(cafe);

    return plainToInstance(Cafe, data);
  }

  public async delete(id: number, current: Payload): Promise<void> {
    const cafe = await this.getById(id);

    if (!cafe) {
      throw new NotFoundException('Cafe not found');
    }

    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    cafe.isDelete = true;
    cafe.deletedAt = new Date();

    await this.cafeRepository.save(cafe);
  }
}
