import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { CafeService } from '../cafe.service';
import { ManagerService } from '../manager/manager.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

const mockMenuRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
});

const mockCafeService = () => ({
  getById: jest.fn(),
});

const mockManagerService = () => ({
  getManagerByusernameAndCafeId: jest.fn(),
});

describe('MenuService', () => {
  let menuService: MenuService;
  let menuRepository: Repository<Menu>;
  let cafeService: CafeService;
  let managerService: ManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: getRepositoryToken(Menu), useFactory: mockMenuRepository },
        { provide: CafeService, useFactory: mockCafeService },
        { provide: ManagerService, useFactory: mockManagerService },
      ],
    }).compile();

    menuService = module.get<MenuService>(MenuService);
    menuRepository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
    cafeService = module.get<CafeService>(CafeService);
    managerService = module.get<ManagerService>(ManagerService);
  });

  describe('getsByCafe', () => {
    it('should return menus by cafe ID', async () => {
      const cafeId = 1;
      const menus = [
        { id: 1, name: 'Menu A', cafe: { id: cafeId }, isDelete: false },
      ];
      cafeService.getById = jest.fn().mockResolvedValue({ id: cafeId });

      menuRepository.find = jest.fn().mockResolvedValue(menus);

      const result = await menuService.getsByCafe(cafeId);
      expect(result).toEqual(menus);
    });

    it('should throw BadRequestException if cafe not found', async () => {
      const cafeId = 1;
      cafeService.getById = jest.fn().mockResolvedValue(null);

      await expect(menuService.getsByCafe(cafeId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should create a menu successfully', async () => {
      const cafeId = 1;
      const menuData = { name: 'Menu A', price: 10.0 };
      const currentUser = { username: 'user1', role: 'admin' };

      cafeService.getById = jest
        .fn()
        .mockResolvedValue({ id: cafeId, owner: { username: 'user1' } });
      managerService.getManagerByusernameAndCafeId = jest
        .fn()
        .mockResolvedValue(null);
      menuRepository.save = jest.fn().mockResolvedValue(menuData);

      await menuService.create(cafeId, menuData, currentUser);

      expect(menuRepository.save).toHaveBeenCalledWith({
        ...menuData,
        cafe: { id: cafeId, owner: { username: 'user1' } },
      });
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      const cafeId = 1;
      const menuData = { name: 'Menu A', price: 10.0 };
      const currentUser = { username: 'user2', role: 'user' };

      cafeService.getById = jest
        .fn()
        .mockResolvedValue({ id: cafeId, owner: { username: 'user1' } });
      managerService.getManagerByusernameAndCafeId = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        menuService.create(cafeId, menuData, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a menu successfully', async () => {
      const cafeId = 1;
      const menuId = 1;
      const updateData = { name: 'Updated Menu', price: 15.0 };
      const currentUser = { username: 'user1', role: 'admin' };

      cafeService.getById = jest
        .fn()
        .mockResolvedValue({ id: cafeId, owner: { username: 'user1' } });
      managerService.getManagerByusernameAndCafeId = jest
        .fn()
        .mockResolvedValue(null);
      menuRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ id: menuId, cafe: { id: cafeId } });
      menuRepository.save = jest
        .fn()
        .mockResolvedValue({ ...updateData, id: menuId });

      const result = await menuService.update(
        cafeId,
        menuId,
        updateData,
        currentUser,
      );

      expect(result).toEqual({ ...updateData, id: menuId });
      expect(menuRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if menu not found', async () => {
      const cafeId = 1;
      const menuId = 1;
      const updateData = { name: 'Updated Menu' };
      const currentUser = { username: 'user1', role: 'admin' };

      cafeService.getById = jest
        .fn()
        .mockResolvedValue({ id: cafeId, owner: { username: 'user1' } });
      managerService.getManagerByusernameAndCafeId = jest
        .fn()
        .mockResolvedValue(null);
      menuRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(
        menuService.update(cafeId, menuId, updateData, currentUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a menu successfully', async () => {
      const cafeId = 1;
      const menuId = 1;
      const currentUser = { username: 'user1', role: 'admin' };

      cafeService.getById = jest
        .fn()
        .mockResolvedValue({ id: cafeId, owner: { username: 'user1' } });
      managerService.getManagerByusernameAndCafeId = jest
        .fn()
        .mockResolvedValue(null);
      menuRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ id: menuId, isDelete: false });
      menuRepository.save = jest
        .fn()
        .mockResolvedValue({ id: menuId, isDelete: true });

      await menuService.delete(cafeId, menuId, currentUser);

      expect(menuRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if menu not found', async () => {
      const cafeId = 1;
      const menuId = 1;
      const currentUser = { username: 'user1', role: 'admin' };

      cafeService.getById = jest
        .fn()
        .mockResolvedValue({ id: cafeId, owner: { username: 'user1' } });
      managerService.getManagerByusernameAndCafeId = jest
        .fn()
        .mockResolvedValue(null);
      menuRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(
        menuService.delete(cafeId, menuId, currentUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
