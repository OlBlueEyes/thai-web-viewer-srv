import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/** GET /viewer/links - VLM이 매칭된 링크 목록 (맵 표시용) */
export class GetLinksDto {
  /** true면 link_id가 있는 vlm_frame이 하나라도 있는 링크만 */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasVlm?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;
}
