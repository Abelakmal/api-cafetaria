import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './manager.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from 'src/modules/user/user.service';
import { CafeService } from '../cafe.service';
import { Payload } from 'src/modules/auth/auth.interface';
import { User, UserRole } from 'src/modules/user/user.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    private userService: UserService,
    private cafeService: CafeService,
  ) {}

  public async create(
    cafeId: number,
    createUserDto: Partial<User>,
    current: Payload,
  ): Promise<void> {
    const cafe = await this.cafeService.getById(cafeId);

    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    await this.managerRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        createUserDto.role = UserRole.MANAGER;
        const user = entityManager.create(User, createUserDto);
        const savedUser = await this.userService.create(user, entityManager);

        const manager = entityManager.create(Manager, {
          cafe,
          manager: savedUser,
        });

        await entityManager.save(manager);
      },
    );
  }

  public async getManagerByCafeId(
    cafeId: number,
    current: Payload,
  ): Promise<Manager[]> {
    const cafe = await this.cafeService.getById(cafeId);
    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
    const manager = await this.managerRepository.find({
      where: {
        cafe: {
          id: cafeId,
          owner: {
            username: current.username,
            isDelete: false,
          },
        },
        user: {
          isDelete: false,
        },
      },
      relations: ['user'],
    });

    return manager;
  }

  public async getManagerByusernameAndCafeId(
    username: string,
    cafeId: number,
  ): Promise<Manager> {
    const manager = await this.managerRepository.findOne({
      where: {
        user: {
          username,
        },
        cafe: {
          id: cafeId,
        },
      },
    });
    return manager;
  }

  public async delete(
    cafeId: number,
    managerId: number,
    current: Payload,
  ): Promise<void> {
    const cafe = await this.cafeService.getById(cafeId);

    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    const manager = await this.managerRepository.findOne({
      where: {
        id: managerId,
        cafe: {
          id: cafeId,
        },
      },
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    await this.managerRepository.remove(manager);
  }
}
