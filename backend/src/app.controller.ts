import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'Cloth Inventory API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('api/test')
  getTest() {
    return {
      message: 'API is working!',
      endpoints: {
        health: '/health',
        root: '/',
      },
    };
  }
}
