import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'ok',
      message: 'Backend is running',
      timestamp: new Date().toISOString(),
    };
  }
}
