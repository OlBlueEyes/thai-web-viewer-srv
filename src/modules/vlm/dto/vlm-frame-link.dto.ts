import { IsNotEmpty, IsString } from 'class-validator';

/** PATCH /vlm/frame/:id/link - MapMatching 결과 link_id만 업데이트 */
export class VlmFrameLinkDto {
  @IsString()
  @IsNotEmpty()
  link_id: string;
}
