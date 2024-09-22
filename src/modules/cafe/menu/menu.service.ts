import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { CafeService } from '../cafe.service';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Payload } from 'src/modules/auth/auth.interface';
import { ManagerService } from '../manager/manager.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private cafeService: CafeService,
    private managerService: ManagerService,
  ) {}

  public async getsByCafe(id: number): Promise<Menu[]> {
    const cafe = await this.cafeService.getById(id);

    if (!cafe) {
      throw new BadRequestException('Cafe not found');
    }
    const data = await this.menuRepository.find({
      where: {
        isDelete: false,
        cafe: {
          id,
        },
      },
    });

    return data;
  }

  public async create(
    cafeId: number,
    menu: Partial<Menu>,
    current: Payload,
  ): Promise<void> {
    const cafe = await this.cafeService.getById(cafeId);

    const manager = await this.managerService.getManagerByusernameAndCafeId(
      current.username,
      cafeId,
    );

    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin' &&
      !manager
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    menu.cafe = cafe;
    menu.price = parseFloat(menu.price.toFixed(2));

    await this.menuRepository.save(menu);
  }

  public async update(
    cafeId: number,
    menuId: number,
    updateMenuDto: Partial<UpdateMenuDto>,
    current: Payload,
  ): Promise<Menu> {
    const cafe = await this.cafeService.getById(cafeId);

    const manager = await this.managerService.getManagerByusernameAndCafeId(
      current.username,
      cafeId,
    );

    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin' &&
      !manager
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    const menu = await this.menuRepository.findOneBy({
      id: menuId,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    if (updateMenuDto.isRecomendation) {
      menu.isRecomendation = updateMenuDto.isRecomendation;
    }

    if (updateMenuDto.name) {
      menu.name = updateMenuDto.name;
    }

    if (updateMenuDto.price) {
      menu.price = parseFloat(updateMenuDto.price.toFixed(2));
    }

    menu.updatedAt = new Date();

    return await this.menuRepository.save(menu);
  }

  public async delete(
    cafeId: number,
    menuId: number,
    current: Payload,
  ): Promise<void> {
    const cafe = await this.cafeService.getById(cafeId);
    const manager = await this.managerService.getManagerByusernameAndCafeId(
      current.username,
      cafeId,
    );

    if (
      current.username !== cafe.owner.username &&
      current.role !== 'superadmin' &&
      !manager
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    const menu = await this.menuRepository.findOneBy({
      id: menuId,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    menu.isDelete = true;
    menu.deletedAt = new Date();

    await this.menuRepository.save(menu);
  }
}
