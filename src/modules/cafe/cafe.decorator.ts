import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateCafeDto } from './dto/update-cafe.dto';

export const DocGetCafe = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'get all cafe' })(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'get all cafe',
      description: 'can be accessed by all users',
    })(target, propertyKey, descriptor);
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
    })(target, propertyKey, descriptor);
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      example: 10,
    })(target, propertyKey, descriptor);
  };
};

export const DocCreateCafe = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'add new cafe',
      description:
        'Only accessible by users with the role of superadmin or owner of cafe',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 201,
      description: 'Cafe created successfully.',
      links: {},
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 400,
      description: ' phone number already in use',
      links: {},
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      links: {},
    })(target, propertyKey, descriptor);
  };
};

export const DocUpdateCafe = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'update cafe',
      description:
        'Only accessible by users with the role of superadmin or owner of cafe',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
    })(target, propertyKey, descriptor);
    ApiBody({
      type: UpdateCafeDto,
      description: 'Fields to update for the Cafe',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'Cafe updated successfully.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 400,
      description: 'Validation errors or Phone Number already taken.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'You do not have permission to perform this action',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Cafe not found.',
    })(target, propertyKey, descriptor);
  };
};

export const DocDeleteCafe = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'update cafe',
      description:
        'Only accessible by users with the role of superadmin or owner of cafe',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Cafe not found.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'You do not have permission to perform this action',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'Cafe deleted successfully.',
    })(target, propertyKey, descriptor);
  };
};
