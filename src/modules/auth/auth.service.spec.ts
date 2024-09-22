import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from './dto/login-response.dto';

describe('AuthService', () => {
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const user: Partial<User> = {
        username: 'testuser',
        password: await bcrypt.hash('testpass', 10),
        role: UserRole.SUPERADMIN,
      };
      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toEqual(user);
      expect(mockUserService.findByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(
        authService.validateUser('testuser', 'testpass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user: Partial<User> = {
        username: 'testuser',
        password: await bcrypt.hash('testpass', 10),
        role: UserRole.SUPERADMIN,
      };
      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.validateUser('testuser', 'wrongpass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a login response', async () => {
      const user: Partial<User> = {
        id: 1,
        username: 'testuser',
        role: UserRole.SUPERADMIN,
        password: 'hashedpass',
      };
      const payload = { username: user.username, role: user.role };
      const token = 'someAccessToken';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result: LoginResponse = await authService.login(user as User);
      expect(result).toEqual({ access_token: token });
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });
  });
});
