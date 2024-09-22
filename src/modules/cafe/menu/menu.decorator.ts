import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const DocGetMenuByCafe = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'get all menu By cafeId',
      description: 'can be accessed by all users',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'cafeId',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Cafe not found.',
    })(target, propertyKey, descriptor);
  };
};

export const DocCreateMenu = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'update cafe',
      description:
        'Only accessible by users with the role of superadmin , owner of cafe , manager of cafe',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'cafeId',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 201,
      description: 'Menu created successfully.',
      links: {},
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

export const DocUpdateMenu = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'update cafe',
      description:
        'Only accessible by users with the role of superadmin , owner of cafe , manager of cafe',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'cafeId',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'menuId',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Cafe not found.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'Menu updated successfully.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'You do not have permission to perform this action',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Menu not found.',
    })(target, propertyKey, descriptor);
  };
};

export const DocDeletemenu = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'update cafe',
      description:
        'Only accessible by users with the role of superadmin , owner of cafe , manager of cafe',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'cafeId',
    })(target, propertyKey, descriptor);
    ApiParam({
      name: 'menuId',
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
    ApiResponse({
      status: 404,
      description: 'Menu not found.',
    })(target, propertyKey, descriptor);
  };
};
