import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ResponsePagination } from 'src/common/types/response-pagination.interface';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getUsers: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const result: ResponsePagination<User> = {
        data: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      jest.spyOn(userService, 'getUsers').mockResolvedValue(result);

      expect(await userController.getUsers('1', '10')).toBe(result);
      expect(userService.getUsers).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'test',
        role: UserRole.SUPERADMIN,
        username: 'test',
        password: 'test123',
      };

      await userController.createUser(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        fullname: 'anto',
        username: 'anto123',
      };
      const id = 1;
      const req = {
        user: {
          username: 'budi',
          role: 'superadmin',
        },
      };
      const result: User = {
        id,
        fullname: 'anto',
        username: 'anto123',
        password: 'hashedpassword',
        role: UserRole.SUPERADMIN,
        isDelete: false,
        deletedAt: null,
        createdAt: null,
        updatedAt: null,
        managedCafes: [],
        cafes: [],
      };

      jest.spyOn(userService, 'update').mockResolvedValue(result);

      expect(await userController.updateUser(id, updateUserDto, req)).toBe(
        result,
      );
      expect(userService.update).toHaveBeenCalledWith(
        updateUserDto,
        id,
        req.user,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const id = 1;
      const req = {
        user: {
          username: 'budi',
          role: 'superadmin',
        },
      };

      await userController.deleteUser(id, req);

      expect(userService.delete).toHaveBeenCalledWith(id, req.user);
    });
  });
});
