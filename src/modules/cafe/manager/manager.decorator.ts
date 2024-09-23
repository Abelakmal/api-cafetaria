import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const DocGetManager = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({ summary: 'get all Manager' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOperation({
      summary: 'get all Manager',
      description:
        'Only accessible by users with the role of superadmin or owner of cafe',
    })(target, propertyKey, descriptor);
  };
};

export const DocCreateManager = () => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'add new manager cafe',
      description:
        'Only accessible by users with the role of superadmin or owner of cafe',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'You do not have permission to perform this action',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 201,
      description: 'Cafe created successfully.',
      links: {},
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Cafe not found.',
    })(target, propertyKey, descriptor);
    ApiBadRequestResponse({
      description: 'Bad Request. Validation errors or user already exists.',
    })(target, propertyKey, descriptor);
  };
};

export const DocDeleteManager = () => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'delete manager from cafe',
      description:
        'Only accessible by users with the role of superadmin or owner of cafe',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 401,
      description: 'You do not have permission to perform this action',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Cafe not found.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'Manager not found',
    });
  };
};
