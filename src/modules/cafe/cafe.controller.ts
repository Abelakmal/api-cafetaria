import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ResponsePagination } from 'src/common/types/response-pagination.interface';
import { Cafe } from './cafe.entity';
import { ApiTags } from '@nestjs/swagger';
import { CafeService } from './cafe.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { Payload } from '../auth/auth.interface';
import { MenuService } from './menu/menu.service';
import {
  DocCreateCafe,
  DocDeleteCafe,
  DocGetCafe,
  DocUpdateCafe,
} from './cafe.decorator';
import { Menu } from './menu/menu.entity';
import {
  DocCreateMenu,
  DocDeletemenu,
  DocGetMenuByCafe,
  DocUpdateMenu,
} from './menu/menu.decorator';
import { CreateMenuDto } from './menu/dto/create-menu.dto';
import { UpdateMenuDto } from './menu/dto/update-menu.dto';
import {
  DocCreateManager,
  DocDeleteManager,
} from './manager/manager.decorator';
import { ManagerService } from './manager/manager.service';
import { CreateUserManager } from './manager/dto/create-user-manager.dto';

@Controller('cafes')
@ApiTags('cafe')
export class CafeController {
  constructor(
    private readonly cafeService: CafeService,
    private readonly menuService: MenuService,
    private readonly managerService: ManagerService,
  ) {}

  @Get()
  @DocGetCafe()
  public async getCafes(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ResponsePagination<Cafe>> {
    const pageNumber = page ? Number(page) : 1;
    const pageSizeNumber = pageSize ? Number(pageSize) : 10;
    return await this.cafeService.gets(pageNumber, pageSizeNumber);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner')
  @DocCreateCafe()
  public async createCafe(
    @Body() createCafeDto: CreateCafeDto,
    @Request() req: any,
  ): Promise<void> {
    await this.cafeService.create(createCafeDto, req.user as Payload);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner')
  @DocUpdateCafe()
  public async updateCafe(
    @Param('id') id: number,
    @Body() updateCafeDto: UpdateCafeDto,
    @Request() req: any,
  ): Promise<Cafe> {
    return await this.cafeService.update(
      updateCafeDto,
      id,
      req.user as Payload,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner')
  @DocDeleteCafe()
  public async deleteCafe(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<void> {
    await this.cafeService.delete(id, req.user as Payload);
  }

  @Post(':cafeId/managers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner')
  @DocCreateManager()
  public async createManager(
    @Param('cafeId') cafeId: number,
    @Body() createUserManager: CreateUserManager,
    @Request() req: any,
  ): Promise<void> {
    await this.managerService.create(cafeId, createUserManager, req.user);
  }

  @Delete(':cafeId/managers/:managerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner')
  @DocDeleteManager()
  public async deleteManager(
    @Param('cafeId') cafeId: number,
    @Param('managerId') managerId: number,
    @Request() req: any,
  ): Promise<void> {
    await this.managerService.delete(cafeId, managerId, req.user);
  }

  @Get(':cafeId/menus')
  @DocGetMenuByCafe()
  public async getMenu(@Param('cafeId') cafeId: number): Promise<Menu[]> {
    return await this.menuService.getsByCafe(cafeId);
  }

  @Post(':cafeId/menus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner', 'manager')
  @DocCreateMenu()
  public async createMenu(
    @Param('cafeId') cafeId: number,
    @Body() createMenuDto: CreateMenuDto,
    @Request() req: any,
  ): Promise<void> {
    await this.menuService.create(cafeId, createMenuDto, req.user as Payload);
  }

  @Patch(':cafeId/menus/:menuId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner', 'manager')
  @DocUpdateMenu()
  public async updateMenu(
    @Param('cafeId') cafeId: number,
    @Param('menuId') menuId: number,
    @Body() updateMenuDto: UpdateMenuDto,
    @Request() req: any,
  ): Promise<Menu> {
    return await this.menuService.update(
      cafeId,
      menuId,
      updateMenuDto,
      req.user as Payload,
    );
  }

  @Delete(':cafeId/menus/:menuId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'owner', 'manager')
  @DocDeletemenu()
  public async deleteMenu(
    @Param('cafeId') cafeId: number,
    @Param('menuId') menuId: number,
    @Request() req: any,
  ): Promise<void> {
    return await this.menuService.delete(cafeId, menuId, req.user as Payload);
  }
}
