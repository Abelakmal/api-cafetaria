import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResponsePagination } from 'src/common/types/response-pagination.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Payload } from '../auth/auth.interface';
import {
  DocCreateUser,
  DocDeleteUser,
  DocGetUsers,
  DocUpdateUser,
} from './user.decorator';

@ApiTags('user')
@ApiExtraModels(CreateUserDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @DocGetUsers()
  public async getUsers(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ResponsePagination<User>> {
    const pageNumber = page ? Number(page) : 1;
    const pageSizeNumber = pageSize ? Number(pageSize) : 10;
    return await this.userService.getUsers(pageNumber, pageSizeNumber);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @DocCreateUser()
  public async createUser(@Body() user: CreateUserDto): Promise<void> {
    await this.userService.create(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @DocUpdateUser()
  public async updateUser(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
    @Request() req: any,
  ): Promise<User> {
    return await this.userService.update(user, id, req.user as Payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @DocDeleteUser()
  public async deleteUser(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<void> {
    await this.userService.delete(id, req.user as Payload);
  }
}
