import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Mesajlaşma (Messages)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications/:applicationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Başvuruya Ait Mesaj Geçmişini Getir' })
  @Get()
  getMessages(
    @Param('applicationId') applicationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.messagesService.getMessagesByApplication(applicationId, userId);
  }

  @ApiOperation({ summary: 'Başvuru Üzerinden Mesaj Gönder' })
  @Post()
  sendMessage(
    @Param('applicationId') applicationId: string,
    @CurrentUser('id') userId: string,
    @Body('content') content: string,
    @Body('attachmentUrl') attachmentUrl?: string,
  ) {
    return this.messagesService.sendMessage(
      applicationId,
      userId,
      content,
      attachmentUrl,
    );
  }
}
