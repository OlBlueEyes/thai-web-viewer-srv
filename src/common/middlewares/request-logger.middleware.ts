import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip || req.socket.remoteAddress || '';
    const startedAt = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || '0';
      const elapsedMs = Date.now() - startedAt;

      this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${elapsedMs}ms - ${userAgent} ${ip}`);
    });

    next();
  }
}
