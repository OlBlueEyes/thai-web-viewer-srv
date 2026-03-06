import { Controller, Get, HttpCode, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ViewerService } from './viewer.service';
import { GetPoiDetailDto } from './dto/get-poi-detail.dto';
import { GetLinkVlmDto } from './dto/get-link-vlm.dto';
import { GetPoiListDto } from './dto/get-poi-list.dto';
import { GetLinksDto } from './dto/get-links.dto';
import { GetVlmFramesDto } from './dto/get-vlm-frames.dto';

@Controller('viewer')
export class ViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  /**
   * GET /viewer/poi/detail?poiId=xxx
   * 개별 POI 조회 (data-align, replica-city-v2 시각화용)
   */
  @Get('poi/detail')
  @HttpCode(200)
  async getPoiDetail(@Query() query: GetPoiDetailDto) {
    return this.viewerService.getPoiDetail(query);
  }

  /**
   * GET /viewer/poi/list - bbox(minLon,minLat,maxLon,maxLat) 또는 startTime,endTime, detection_class, limit, offset
   * POI 목록 (맵 표시용)
   */
  @Get('poi/list')
  @HttpCode(200)
  async getPoiList(@Query() query: GetPoiListDto) {
    return this.viewerService.getPoiList(query);
  }

  /**
   * GET /viewer/link/vlm?link_id=xxx&lon=xxx&lat=xxx
   * Link 클릭 시 해당 위치와 가장 가까운 VLM Frame 및 vlm_poi 조회 (replica-city 스타일)
   */
  @Get('link/vlm')
  @HttpCode(200)
  async getLinkVlm(@Query() query: GetLinkVlmDto) {
    return this.viewerService.getLinkVlm(query);
  }

  /**
   * GET /viewer/links - hasVlm, limit, offset (VLM 매칭된 링크만 옵션)
   */
  @Get('links')
  @HttpCode(200)
  async getLinks(@Query() query: GetLinksDto) {
    return this.viewerService.getLinks(query);
  }

  /**
   * GET /viewer/links/vlm-poi-segments - VLM_POI가 있는 링크 구간 GeoJSON (링크 위 하이라이트용)
   */
  @Get('links/vlm-poi-segments')
  @HttpCode(200)
  async getLinkVlmPoiSegments() {
    return this.viewerService.getLinkVlmPoiSegments();
  }

  /**
   * GET /viewer/vlm-frames - bbox(minLon,minLat,maxLon,maxLat), limit (줌인 시 맵에 모든 프레임 표시용)
   */
  @Get('vlm-frames')
  @HttpCode(200)
  async getVlmFrames(@Query() query: GetVlmFramesDto) {
    return this.viewerService.getVlmFrames(query);
  }

  /**
   * GET /viewer/image/frame/:id - POI Frame 이미지 스트리밍
   */
  @Get('image/frame/:id')
  @HttpCode(200)
  async getFrameImage(@Param('id') id: string, @Res() res: Response) {
    return this.viewerService.getFrameImage(id, res);
  }

  /**
   * GET /viewer/image/vlm-frame/:id - VLM Frame 이미지 스트리밍
   */
  @Get('image/vlm-frame/:id')
  @HttpCode(200)
  async getVlmFrameImage(@Param('id') id: string, @Res() res: Response) {
    return this.viewerService.getVlmFrameImage(id, res);
  }

  /**
   * GET /viewer/detection-classes/poi - POI Detection Class 목록
   */
  @Get('detection-classes/poi')
  @HttpCode(200)
  async getDetectionClassesPoi() {
    return this.viewerService.getDetectionClassesPoi();
  }

  /**
   * GET /viewer/detection-classes/vlm - VLM Detection Class 목록
   */
  @Get('detection-classes/vlm')
  @HttpCode(200)
  async getDetectionClassesVlm() {
    return this.viewerService.getDetectionClassesVlm();
  }
}
