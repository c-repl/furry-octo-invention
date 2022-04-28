import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import assert = require('assert');
import { AppService } from './app.service';
import { ScheduleDTO } from './DTO/schedule.dto';
import SendNotificationDTO from './DTO/send.dto';
import { MediumsService } from './mediums/mediums.service';
import { SchedulerService } from './scheduler/scheduler.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mediumService: MediumsService,
    private schedulerService: SchedulerService,
  ) {}
  @Post('/send')
  async sendNotification(@Body() body: SendNotificationDTO) {
    assert(
      this.mediumService.validateMediumId(body.mediumId),
      new HttpException(
        `Medium ${body.mediumId} is not supported`,
        HttpStatus.SERVICE_UNAVAILABLE,
      ),
    );
    assert(
      this.mediumService.validateTarget(body.mediumId, body.userId),
      new HttpException('Invalid userId', HttpStatus.BAD_REQUEST),
    );
    await this.mediumService
      .sendNotification(body.mediumId, body.userId, body.message)
      .catch((e) => new HttpException(e.message, 500));
    return { sent: true };
  }
  @Post('/schedule')
  async scheduleNotification(@Body() body: ScheduleDTO) {
    ScheduleDTO.init(body);
    try {
      await this.schedulerService.scheduleMessage(body);
      return { scheduled: true, schedule_id: body.id };
    } catch (e) {
      return { scheduled: false, message: e.message };
    }
  }

  @Post(`/pause/:schedule_id`)
  async pauseNotification(@Param('schedule_id') schedule_id: string) {
    this.schedulerService.pauseScheduled(schedule_id);
    return { schedule: false, schedule_id };
  }
  @Post(`/continue/:schedule_id`)
  async continueNotification(@Param('schedule_id') schedule_id: string) {
    this.schedulerService.continueScheduled(schedule_id);
    return { scheduled: true, schedule_id };
  }
}
