import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './constants/cloudinary.service';
import { SuccessResponse, ErrorResponse } from './constants/response';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('extract-colors')
  async extractColors(@Body('imageUrl') imageUrl: string) {
    try {
      const colors = await this.cloudinaryService.getDominantColors(imageUrl);
      return SuccessResponse('Colors extracted successfully', colors);
    } catch (error) {
      return ErrorResponse(error.message);
    }
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
