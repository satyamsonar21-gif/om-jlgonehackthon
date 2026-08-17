import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':userId') getForUser(@Param('userId') userId: string, @Query() query: any) { return this.notificationsService.getForUser(userId, query); }
  @Patch(':id/read') markRead(@Param('id') id: string) { return this.notificationsService.markRead(id); }
  @Patch(':userId/read-all') markAllRead(@Param('userId') userId: string) { return this.notificationsService.markAllRead(userId); }
}
