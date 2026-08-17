import { Controller, Post, Get, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('resume')
  @UseInterceptors(FileInterceptor('file'))
  uploadResume(@UploadedFile() file: any, @Body() body: any) {
    return this.uploadsService.uploadResume(file, body.studentId);
  }

  @Get('signed-url')
  getSignedUrl(@Body() body: any) {
    return this.uploadsService.getSignedUrl(body.path);
  }
}
