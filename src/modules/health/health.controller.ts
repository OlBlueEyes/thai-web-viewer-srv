import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /health - 서버 및 DB 상태
   */
  @Get()
  async check() {
    return this.healthService.check();
  }
}
