import { Body, Controller, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { VlmService } from './vlm.service';
import { VlmFrameDto } from './dto/vlm-frame.dto';
import { VlmUpdateDto } from './dto/vlm-update.dto';
import { VlmFrameLinkDto } from './dto/vlm-frame-link.dto';

@Controller('vlm')
export class VlmController {
  constructor(private readonly vlmService: VlmService) {}

  /**
   * VLM Frame 수신 (10m 주기) - 서비스용 vlm_frame + 학습용 training_frame 동시 저장
   */
  @Post('frame')
  @HttpCode(200)
  async receiveFrame(@Body() dto: VlmFrameDto) {
    return this.vlmService.receiveFrame(dto);
  }

  /**
   * VLM 추론 결과 저장
   * Body: vlm_frame_id, [link_id], veg_encroachment, soil_subsidence, guardrail_damage, lane_damage, sign_damage
   * link_id 있으면 vlm_frame.link_id 업데이트 (MapMatching 결과)
   */
  @Post('update')
  @HttpCode(200)
  async updateResult(@Body() dto: VlmUpdateDto) {
    return this.vlmService.updateResult(dto);
  }

  /**
   * VLM Frame의 link_id만 업데이트 (MapMatching 서비스 호출용)
   */
  @Patch('frame/:id/link')
  @HttpCode(200)
  async updateFrameLink(
    @Param('id') id: string,
    @Body() dto: VlmFrameLinkDto,
  ) {
    return this.vlmService.updateFrameLink(id, dto.link_id);
  }
}
