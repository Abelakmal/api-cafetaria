import { Test, TestingModule } from '@nestjs/testing';
import { CafeService } from './cafe.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cafe } from './cafe.entity';
import { UserService } from '../user/user.service';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../user/user.entity';

const mockCafeRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockUserService = () => ({
  findByUsername: jest.fn(),
});

describe('CafeService', () => {
  let cafeService: CafeService;
  let cafeRepository: Repository<Cafe>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CafeService,
        { provide: getRepositoryToken(Cafe), useFactory: mockCafeRepository },
        { provide: UserService, useFactory: mockUserService },
      ],
    }).compile();

    cafeService = module.get<CafeService>(CafeService);
    cafeRepository = module.get<Repository<Cafe>>(getRepositoryToken(Cafe));
    userService = module.get<UserService>(UserService);
  });

  describe('gets', () => {
    it('should return paginated cafes', async () => {
      const cafes: Cafe[] = [
        {
          id: 1,
          name: 'Cafe A',
          address: '123 Street',
          isDelete: false,
          phoneNumber: '+624252520',
          deletedAt: null,
          createdAt: null,
          updatedAt: null,
          owner: {
            id: 0,
            fullname: '',
            username: '',
            password: '',
            isDelete: false,
            deletedAt: undefined,
            cafes: [],
            role: UserRole.SUPERADMIN,
            createdAt: undefined,
            updatedAt: undefined,
            managedCafes: [],
          },
          menus: [],
        },
      ];
      (
        cafeRepository.createQueryBuilder().getManyAndCount as jest.Mock
      ).mockResolvedValue([cafes, 1]);

      const result = await cafeService.gets(1, 10);

      expect(result).toEqual({
        total: 0,
        skip: 0,
        limit: 10,
        data: [],
      });
    });
  });

  describe('getById', () => {
    it('should return a cafe if found', async () => {
      const cafe = { id: 1, name: 'Cafe A' };
      (cafeRepository.findOne as jest.Mock).mockResolvedValue(cafe);

      const result = await cafeService.getById(1);

      expect(result).toEqual(cafe);
    });

    it('should throw NotFoundException if cafe not found', async () => {
      (cafeRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(cafeService.getById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a cafe successfully', async () => {
      const cafe = { phoneNumber: '12345' };
      const user = { username: 'user1' };
      (cafeRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userService.findByUsername as jest.Mock).mockResolvedValue(user);

      await cafeService.create(cafe, { username: 'user1', role: 'admin' });

      expect(cafeRepository.save).toHaveBeenCalledWith({
        ...cafe,
        owner: user,
      });
    });

    it('should throw BadRequestException if phone number is already in use', async () => {
      (cafeRepository.findOne as jest.Mock).mockResolvedValue({
        phoneNumber: '12345',
      });

      await expect(
        cafeService.create(
          { phoneNumber: '12345' },
          { username: 'user1', role: 'admin' },
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      (cafeRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userService.findByUsername as jest.Mock).mockResolvedValue(null);

      await expect(
        cafeService.create(
          { phoneNumber: '12345' },
          { username: 'user1', role: 'admin' },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cafe successfully', async () => {
      const cafe = {
        id: 1,
        phoneNumber: '12345',
        owner: { username: 'user1' },
      };

      (cafeRepository.findOne as jest.Mock).mockResolvedValueOnce(cafe);

      const updateCafeDto = { phoneNumber: '54321' };

      (cafeRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      await cafeService.update(updateCafeDto, 1, {
        username: 'user1',
        role: 'admin',
      });

      expect(cafeRepository.save).toHaveBeenCalledWith({
        ...cafe,
        phoneNumber: '54321',
      });
    });

    it('should throw NotFoundException if cafe not found', async () => {
      (cafeRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        cafeService.update({ phoneNumber: '54321' }, 1, {
          username: 'user1',
          role: 'admin',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      const cafe = { id: 1, owner: { username: 'user2' } };
      (cafeRepository.findOne as jest.Mock).mockResolvedValue(cafe);

      await expect(
        cafeService.update({ phoneNumber: '54321' }, 1, {
          username: 'user1',
          role: 'admin',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should soft delete a cafe successfully', async () => {
      const cafe = { id: 1, owner: { id: 1, username: 'user1' } };
      jest.spyOn(cafeService, 'getById').mockResolvedValue(cafe as Cafe);

      await cafeService.delete(1, { username: 'user1', role: 'admin' });

      expect(cafeRepository.save).toHaveBeenCalledWith({
        ...cafe,
        isDelete: true,
        deletedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if cafe not found', async () => {
      jest.spyOn(cafeService, 'getById').mockResolvedValue(null);

      await expect(
        cafeService.delete(1, { username: 'user1', role: 'admin' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      const cafe = { id: 1, owner: { username: 'user2' } };
      jest.spyOn(cafeService, 'getById').mockResolvedValue(cafe as Cafe);

      await expect(
        cafeService.delete(1, { username: 'user1', role: 'admin' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
