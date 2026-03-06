import { IsNotEmpty, IsString } from 'class-validator';

export class GetPoiDetailDto {
  @IsString()
  @IsNotEmpty()
  poiId: string;
}
