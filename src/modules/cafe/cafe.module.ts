import { Module } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cafe } from './cafe.entity';
import { UserModule } from '../user/user.module';
import { MenuService } from './menu/menu.service';
import { Menu } from './menu/menu.entity';
import { ManagerService } from './manager/manager.service';
import { Manager } from './manager/manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cafe, Menu, Manager]), UserModule],
  providers: [CafeService, MenuService, ManagerService],
  controllers: [CafeController],
  exports: [CafeService],
})
export class CafeModule {}
