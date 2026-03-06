import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetLinkVlmDto {
  @IsString()
  @IsNotEmpty()
  link_id: string;

  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @Type(() => Number)
  lon: number;

  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @Type(() => Number)
  lat: number;
}
