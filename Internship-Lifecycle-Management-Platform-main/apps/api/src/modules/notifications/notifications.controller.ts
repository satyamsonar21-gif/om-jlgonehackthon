import { Controller, Get, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications for current authenticated user' })
  getMyNotifications(@Request() req: any, @Query() query: any) {
    const userId = req.user?.id;
    return this.notificationsService.getForUser(userId, query);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get notifications for specific user ID' })
  getForUser(@Param('userId') userId: string, @Query() query: any) {
    return this.notificationsService.getForUser(userId, query);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read' })
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Patch(':userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  markAllRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }
}
