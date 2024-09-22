import { Test, TestingModule } from '@nestjs/testing';
import { CafeController } from './cafe.controller';
import { CafeService } from './cafe.service';
import { MenuService } from './menu/menu.service';
import { ManagerService } from './manager/manager.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { CreateUserManager } from './manager/dto/create-user-manager.dto';
import { ResponsePagination } from 'src/common/types/response-pagination.interface';
import { Cafe } from './cafe.entity';
import { Menu } from './menu/menu.entity';
import { CreateMenuDto } from './menu/dto/create-menu.dto';
import { UpdateMenuDto } from './menu/dto/update-menu.dto';

describe('CafeController', () => {
  let cafeController: CafeController;
  let cafeService: CafeService;
  let menuService: MenuService;
  let managerService: ManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CafeController],
      providers: [
        {
          provide: CafeService,
          useValue: {
            gets: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: MenuService,
          useValue: {
            getsByCafe: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ManagerService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    cafeController = module.get<CafeController>(CafeController);
    cafeService = module.get<CafeService>(CafeService);
    menuService = module.get<MenuService>(MenuService);
    managerService = module.get<ManagerService>(ManagerService);
  });

  describe('getCafes', () => {
    it('should return a paginated list of cafes', async () => {
      const response: ResponsePagination<Cafe> = {
        data: [],
        total: 0,
        skip: 0,
        limit: 10,
      };
      jest.spyOn(cafeService, 'gets').mockResolvedValue(response);

      const result = await cafeController.getCafes();
      expect(result).toEqual(response);
      expect(cafeService.gets).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('createCafe', () => {
    it('should create a new cafe', async () => {
      const createCafeDto: CreateCafeDto = {
        name: 'Cafe Test',
        address: 'batam',
        phoneNumber: '+62242442028',
      };
      const req = { user: { id: 1 } };

      await cafeController.createCafe(createCafeDto, req);

      expect(cafeService.create).toHaveBeenCalledWith(createCafeDto, req.user);
    });
  });

  describe('updateCafe', () => {
    it('should update an existing cafe', async () => {
      const updateCafeDto: Partial<UpdateCafeDto> = { name: 'Updated Cafe' };
      const req = { user: { id: 1 } };
      const cafeId = 1;

      await cafeController.updateCafe(cafeId, updateCafeDto, req);

      expect(cafeService.update).toHaveBeenCalledWith(
        updateCafeDto,
        cafeId,
        req.user,
      );
    });
  });

  describe('deleteCafe', () => {
    it('should delete a cafe', async () => {
      const req = { user: { id: 1 } };
      const cafeId = 1;

      await cafeController.deleteCafe(cafeId, req);

      expect(cafeService.delete).toHaveBeenCalledWith(cafeId, req.user);
    });
  });

  describe('createManager', () => {
    it('should create a new manager', async () => {
      const createUserManager: CreateUserManager = {
        username: 'managerUser',
        fullname: 'manager budi',
        password: 'rahasia',
      };
      const req = { user: { id: 1 } };
      const cafeId = 1;

      await cafeController.createManager(cafeId, createUserManager, req);

      expect(managerService.create).toHaveBeenCalledWith(
        cafeId,
        createUserManager,
        req.user,
      );
    });
  });

  describe('deleteManager', () => {
    it('should delete a manager', async () => {
      const req = { user: { id: 1 } };
      const cafeId = 1;
      const managerId = 2;

      await cafeController.deleteManager(cafeId, managerId, req);

      expect(managerService.delete).toHaveBeenCalledWith(
        cafeId,
        managerId,
        req.user,
      );
    });
  });

  describe('getMenu', () => {
    it('should return menus for a cafe', async () => {
      const cafeId = 1;
      const menus: Menu[] = [];

      jest.spyOn(menuService, 'getsByCafe').mockResolvedValue(menus);

      const result = await cafeController.getMenu(cafeId);
      expect(result).toEqual(menus);
      expect(menuService.getsByCafe).toHaveBeenCalledWith(cafeId);
    });
  });

  describe('createMenu', () => {
    it('should create a new menu item', async () => {
      const createMenuDto: CreateMenuDto = {
        name: 'New Menu Item',
        price: 2034.0,
        isRecomendation: true,
      };
      const req = { user: { id: 1 } };
      const cafeId = 1;

      await cafeController.createMenu(cafeId, createMenuDto, req);

      expect(menuService.create).toHaveBeenCalledWith(
        cafeId,
        createMenuDto,
        req.user,
      );
    });
  });

  describe('updateMenu', () => {
    it('should update an existing menu item', async () => {
      const updateMenuDto: Partial<UpdateMenuDto> = {
        name: 'Updated Menu Item',
      };
      const req = { user: { id: 1 } };
      const cafeId = 1;
      const menuId = 2;

      await cafeController.updateMenu(cafeId, menuId, updateMenuDto, req);

      expect(menuService.update).toHaveBeenCalledWith(
        cafeId,
        menuId,
        updateMenuDto,
        req.user,
      );
    });
  });

  describe('deleteMenu', () => {
    it('should delete a menu item', async () => {
      const req = { user: { id: 1 } };
      const cafeId = 1;
      const menuId = 2;

      await cafeController.deleteMenu(cafeId, menuId, req);

      expect(menuService.delete).toHaveBeenCalledWith(cafeId, menuId, req.user);
    });
  });
});
