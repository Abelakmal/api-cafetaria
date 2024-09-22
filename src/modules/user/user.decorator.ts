import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export const DocCreateUser = () => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Add new user ',
      description: 'Only accessible by users with the role of superadmin.',
    })(target, propertyKey, descriptor);
    ApiBody({ type: CreateUserDto, description: 'Create a new user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 201,
      description: 'User created successfully.',
    })(target, propertyKey, descriptor);
    ApiBadRequestResponse({
      description: 'Bad Request. Validation errors or user already exists.',
    })(target, propertyKey, descriptor);
  };
};

export const DocGetUsers = () => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'get all user',
      description: 'Only accessible by users with the role of superadmin.',
    })(target, propertyKey, descriptor);
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Pages to be retrieved',
      example: 1,
    })(target, propertyKey, descriptor);
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      description: 'Number of users per page',
      example: 10,
    })(target, propertyKey, descriptor);
  };
};

export const DocUpdateUser = () => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'update user',
      description:
        'Only accessible by users with the role of superadmin, owner and manager.',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
    })(target, propertyKey, descriptor);
    ApiBody({
      type: UpdateUserDto,
      description: 'Fields to update for the user',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'User updated successfully.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'You do not have permission to perform this action',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'User not found.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 400,
      description: 'Validation errors or username already exists.',
    })(target, propertyKey, descriptor);
  };
};

export const DocDeleteUser = () => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'delete user',
      description:
        'Only accessible by users with the role of superadmin, owner and manager.',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'User not found.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'You do not have permission to perform this action',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'User deleted successfully.',
    })(target, propertyKey, descriptor);
  };
};
