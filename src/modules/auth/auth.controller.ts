import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in.',
    example: LoginResponse,
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async loginUser(@Body() login: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      login.username,
      login.password,
    );

    return this.authService.login(user);
  }
}
