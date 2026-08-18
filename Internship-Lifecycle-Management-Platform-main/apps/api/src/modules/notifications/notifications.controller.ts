import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
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

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count for current user' })
  getUnreadCount(@Request() req: any) {
    const userId = req.user?.id;
    return this.notificationsService.getUnreadCount(userId);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences for current user' })
  getMyPreferences(@Request() req: any) {
    const userId = req.user?.id;
    return this.notificationsService.getPreferences(userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences for current user' })
  updateMyPreferences(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.notificationsService.updatePreferences(userId, body);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for current user' })
  markAllMyRead(@Request() req: any) {
    const userId = req.user?.id;
    return this.notificationsService.markAllRead(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read' })
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  deleteNotification(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get notifications for specific user ID' })
  getForUser(@Param('userId') userId: string, @Query() query: any) {
    return this.notificationsService.getForUser(userId, query);
  }

  @Patch(':userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  markAllRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }
}
