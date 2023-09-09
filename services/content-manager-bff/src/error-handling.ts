import { HttpException, HttpStatus } from '@nestjs/common';

export function catchErrorAndThrow(message: string, error: any, status = HttpStatus.INTERNAL_SERVER_ERROR): void {
  console.error(message, error.message);
  throw new HttpException(error.message, status);
}
