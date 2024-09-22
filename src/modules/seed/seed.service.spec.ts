import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('SeedService', () => {
  let seedService: SeedService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a new user if one does not exist', async () => {
    const user = {
      fullname: 'admin',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.SUPERADMIN,
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // No existing user
    jest.spyOn(userRepository, 'save').mockResolvedValue(user as User); // Mock save

    await seedService.seed();

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { username: user.username },
    });
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        fullname: 'admin',
        username: 'admin',
        role: UserRole.SUPERADMIN,
      }),
    );
  });

  it('should not create a user if one already exists', async () => {
    const existingUser = { id: 1, username: 'admin' };

    jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(existingUser as User); // Mock existing user

    await seedService.seed();

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { username: existingUser.username },
    });
    expect(userRepository.save).not.toHaveBeenCalled(); // Save should not be called
  });
});
