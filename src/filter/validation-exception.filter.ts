import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

import {
    HttpException,
    HttpStatus,
  } from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      exceptionResponse instanceof Object && 'message' in exceptionResponse
        ? (exceptionResponse as any).message
        : 'Bad Request';

    const formattedMessage = Array.isArray(message) ? message.join('; ') : message;

    response.status(status).json({
      statusCode: status,
      error: 'Bad Request',
      message: formattedMessage,
    });
  }
}
  
@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse instanceof Object && 'message' in exceptionResponse) {
     const message = Array.isArray(exceptionResponse['message'])
        ? exceptionResponse['message'].join('; ')
        : exceptionResponse['message'];
    } else {
      message = 'An unexpected error occurred';
    }

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status],
      message,
    });
  }
}
