import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExtractUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Images/Media')
@ApiBearerAuth()
@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload image(s) for an entity (Product/Customer/etc.)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        entity_type: { type: 'string', example: 'product' },
        entity_id: { type: 'string', example: '1' },
        image_type: { type: 'string', example: 'main' },
        alt_text: { type: 'string', example: 'Front view' },
      },
    },
  })
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @ExtractUser() user: any,
    @Body('entity_type') entityType: string,
    @Body('entity_id') entityId: string,
    @Body('image_type') imageType?: string,
    @Body('alt_text') altText?: string,
  ) {
    const entityIdNum = parseInt(entityId);
    const userId = user.user_id;

    if (files.length === 1) {
      return this.imagesService.uploadImage(
        files[0],
        entityType,
        entityIdNum,
        userId,
        imageType || 'main',
        true,
        altText,
      );
    }

    return this.imagesService.uploadMultipleImages(
      files,
      entityType,
      entityIdNum,
      userId,
    );
  }

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Get images for a specific entity' })
  @ApiParam({ name: 'entityType', example: 'product' })
  @ApiParam({ name: 'entityId', type: Number })
  async getImagesByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return this.imagesService.getImagesByEntity(entityType, entityId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.deleteImage(id);
  }

  @Post(':id/set-primary')
  @ApiOperation({ summary: 'Set an image as primary for an entity' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  async setPrimaryImage(
    @Param('id', ParseIntPipe) id: number,
    @Body('entity_type') entityType: string,
    @Body('entity_id') entityId: number,
  ) {
    return this.imagesService.setPrimaryImage(id, entityType, entityId);
  }
}
