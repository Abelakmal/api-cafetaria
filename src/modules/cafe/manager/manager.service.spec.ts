import { Test, TestingModule } from '@nestjs/testing';
import { ManagerService } from './manager.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manager } from './manager.entity';
import { UserService } from 'src/modules/user/user.service';
import { CafeService } from '../cafe.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockManagerRepository = () => ({
  findOne: jest.fn(),
  remove: jest.fn(),
  manager: {
    transaction: jest.fn(),
  },
});

const mockUserService = () => ({
  create: jest.fn(),
});

const mockCafeService = () => ({
  getById: jest.fn(),
});

describe('ManagerService', () => {
  let managerService: ManagerService;
  let managerRepository: Repository<Manager>;
  let userService: UserService;
  let cafeService: CafeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagerService,
        {
          provide: getRepositoryToken(Manager),
          useFactory: mockManagerRepository,
        },
        { provide: UserService, useFactory: mockUserService },
        { provide: CafeService, useFactory: mockCafeService },
      ],
    }).compile();

    managerService = module.get<ManagerService>(ManagerService);
    managerRepository = module.get<Repository<Manager>>(
      getRepositoryToken(Manager),
    );
    userService = module.get<UserService>(UserService);
    cafeService = module.get<CafeService>(CafeService);
  });

  describe('create', () => {
    it('should create a manager successfully', async () => {
      const cafeId = 1;
      const createUserDto = { username: 'manager1', password: 'password' };
      const currentUser = { username: 'owner', role: 'owner' };
      const cafe = { id: cafeId, owner: { username: 'owner' } };

      cafeService.getById = jest.fn().mockResolvedValue(cafe);
      userService.create = jest.fn().mockResolvedValue(createUserDto);

      const mockEntityManager = {
        create: jest.fn().mockReturnValue(createUserDto),
        save: jest.fn().mockResolvedValue(createUserDto),
      };

      managerRepository.manager.transaction = jest
        .fn()
        .mockImplementation(async (cb) => cb(mockEntityManager));

      await managerService.create(cafeId, createUserDto, currentUser);

      expect(userService.create).toHaveBeenCalled();
      expect(managerRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const cafeId = 1;
      const createUserDto = { username: 'manager1', password: 'password' };
      const currentUser = { username: 'unauthorized', role: 'user' };
      const cafe = { id: cafeId, owner: { username: 'owner' } };

      cafeService.getById = jest.fn().mockResolvedValue(cafe);

      await expect(
        managerService.create(cafeId, createUserDto, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
  describe('delete', () => {
    it('should delete a manager successfully', async () => {
      const cafeId = 1;
      const managerId = 1;
      const currentUser = { username: 'owner', role: 'owner' };
      const cafe = { id: cafeId, owner: { username: 'owner' } };
      const manager = { id: managerId };

      cafeService.getById = jest.fn().mockResolvedValue(cafe);
      managerRepository.findOne = jest.fn().mockResolvedValue(manager);

      await managerService.delete(cafeId, managerId, currentUser);
      expect(managerRepository.remove).toHaveBeenCalledWith(manager);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const cafeId = 1;
      const managerId = 1;
      const currentUser = { username: 'unauthorized', role: 'user' };
      const cafe = { id: cafeId, owner: { username: 'owner' } };

      cafeService.getById = jest.fn().mockResolvedValue(cafe);

      await expect(
        managerService.delete(cafeId, managerId, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if manager does not exist', async () => {
      const cafeId = 1;
      const managerId = 1;
      const currentUser = { username: 'owner', role: 'owner' };
      const cafe = { id: cafeId, owner: { username: 'owner' } };

      cafeService.getById = jest.fn().mockResolvedValue(cafe);
      managerRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        managerService.delete(cafeId, managerId, currentUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
