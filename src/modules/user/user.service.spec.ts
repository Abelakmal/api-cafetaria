import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUser = {
    id: 1,
    fullname: 'John Doe',
    username: 'john',
    password: 'hashedpassword',
    isDelete: false,
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      mockUserRepository.findAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await userService.getUsers(1, 10);
      expect(result).toEqual({
        total: 1,
        skip: 0,
        limit: 10,
        data: [mockUser],
      });
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findByUsername', () => {
    it('should return user if found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await userService.findByUsername('john');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        username: 'john',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(userService.findByUsername('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'Jane Doe',
        username: 'jane',
        password: 'password123',
        role: UserRole.OWNER,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const result = await userService.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'jane' },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpassword',
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'Jane Doe',
        username: 'jane',
        password: 'password123',
        role: UserRole.OWNER,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(userService.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: Partial<UpdateUserDto> = {
        fullname: 'Jane Doe',
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await userService.update(updateUserDto, mockUser.id, {
        username: 'john',
        role: 'user',
      });
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        userService.update({}, 1, { username: 'john', role: 'user' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      await expect(
        userService.update({ username: 'newusername' }, 1, {
          username: 'otheruser',
          role: 'user',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      await userService.delete(1, { username: 'john', role: 'superadmin' });
      expect(mockUser.isDelete).toBe(true);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        userService.delete(1, { username: 'john', role: 'superadmin' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      await expect(
        userService.delete(1, { username: 'otheruser', role: 'user' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
