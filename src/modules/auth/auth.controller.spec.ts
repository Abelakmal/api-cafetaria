import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('loginUser', () => {
    it('should return a login response when credentials are valid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };
      const expectedResponse: LoginResponse = {
        access_token: 'someAccessToken',
      };

      mockAuthService.validateUser.mockResolvedValue({ username: 'testuser' });
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await authController.loginUser(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'testuser',
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'testpass' };
      mockAuthService.validateUser.mockImplementation(() => {
        throw new UnauthorizedException('Incorrect username or password');
      });

      await expect(authController.loginUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        'testuser',
        'testpass',
      );
    });
  });
});
