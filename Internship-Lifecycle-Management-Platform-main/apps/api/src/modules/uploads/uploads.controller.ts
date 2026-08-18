import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Uploads & Documents')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file with local disk / cloud fallback' })
  uploadFile(@UploadedFile() file: any, @Body() body: any) {
    return this.uploadsService.uploadFile(file, body.folder || 'general');
  }

  @Post('resume')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload student resume and attach to profile' })
  uploadResume(@UploadedFile() file: any, @Body() body: any, @Request() req: any) {
    const studentId = body.studentId || req.user?.student?.id;
    return this.uploadsService.uploadResume(file, studentId);
  }

  @Post('document')
  @ApiOperation({ summary: 'Upload institutional document (Offer letter, NOC, Joining letter)' })
  createDocument(@Body() body: any, @Request() req: any) {
    const uploadedById = req.user?.id;
    return this.uploadsService.createDocument({ ...body, uploadedById });
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get all institutional documents with filtering' })
  getDocuments(@Query() query: any) {
    return this.uploadsService.getDocuments(query);
  }

  @Patch('documents/:id/verify')
  @UseGuards(RolesGuard)
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'FACULTY', 'FACULTY_MENTOR')
  @ApiOperation({ summary: 'Verify or reject uploaded document with remarks' })
  verifyDocument(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const verifiedById = req.user?.id;
    return this.uploadsService.verifyDocument(id, { ...body, verifiedById });
  }

  @Get('checklist/:internshipId')
  @ApiOperation({ summary: 'Get live document verification checklist for internship' })
  getChecklist(@Param('internshipId') internshipId: string) {
    return this.uploadsService.getChecklist(internshipId);
  }

  @Get('signed-url')
  @ApiOperation({ summary: 'Get signed URL for document retrieval' })
  getSignedUrl(@Query() query: any) {
    return this.uploadsService.getSignedUrl(query.path || 'document.pdf');
  }
}
