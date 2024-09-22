import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    let message = (exceptionResponse as any).message || exception.message;

    if (Array.isArray(message)) {
      message = message.join(', ');
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: (exceptionResponse as any).error || 'Bad Request',
    });
  }
}
