import { BadRequestException, NotFoundException } from '@nestjs/common';

export function throwBadRequestException(message: string): never {
  throw new BadRequestException(message);
}

export function throwNotFoundException(message: string): never {
  throw new NotFoundException(message);
}
