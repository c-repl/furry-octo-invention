import { Injectable, Logger } from '@nestjs/common';
import assert = require('assert');
import { IntervalBasedCronScheduler, parseCronExpression } from 'cron-schedule';
import fs = require('fs');
import { MediumsService } from '../mediums/mediums.service';
import { UsersService } from '../users/users.service';
import ScheduleInterface from './scheduler';
const TIMER_RESOLUTION = 10; //SECONDS
@Injectable()
export class SchedulerService {
  logger = new Logger('Scheduler');
  constructor(private mediumService: MediumsService) {
    this.init();
  }
  schedules: Record<string, ScheduleInterface> = {};
  scheduler = new IntervalBasedCronScheduler(TIMER_RESOLUTION * 1000);
  init() {
    try {
      const jsonSchdule = JSON.parse(
        fs.readFileSync('jsondb/schedules.json', 'utf8'),
      );
      this.schedules = jsonSchdule;
      for (const task in this.schedules) {
        const schedule = this.schedules[task];
        if (schedule.status === 'scheduled') this.scheduleMessage(schedule);
      }
    } catch (e) {
      this.logger.warn('No previous saved state found');
    }
  }
  runInstance(schedule: ScheduleInterface) {
    const { id, mediumId, message, userId } = schedule;
    this.logger.debug(`Running scheduled notification ${id}`);
    this.mediumService
      .sendNotification(mediumId, userId, message)
      .catch((err) =>
        this.logger.error(`error in task ${schedule.id}`, err['message']),
      );
  }
  async scheduleMessage(schedule: ScheduleInterface) {
    assert(schedule.status !== 'stopped', new Error('Cannot start this task'));
    const user = UsersService.getUser(schedule.userId);
    assert(user, new Error('User not found'));
    this.schedules[schedule.id] = schedule;
    const cron = parseCronExpression(schedule.cronString);
    const cronInstance = this.scheduler.registerTask(cron, () =>
      this.runInstance(schedule),
    );
    schedule.instance = cronInstance;
    schedule.status = 'scheduled';
    await this.saveState();
    this.logger.debug(
      `Scheduling notification ${schedule.id} through ${schedule.mediumId}, cron: ${schedule.cronString}`,
    );
  }
  async continueScheduled(schedule_id: string) {
    const schedule = this.schedules[schedule_id];
    if (schedule && schedule.status === 'stopped') {
      schedule.status = 'unintiated';
      return this.scheduleMessage(schedule);
    }
    return true;
  }
  async pauseScheduled(schedule_id: string) {
    const schedule = this.schedules[schedule_id];
    if (schedule && schedule.status === 'scheduled') {
      this.scheduler.unregisterTask(schedule.instance);
      this.schedules[schedule_id].instance = undefined;
      schedule.status = 'stopped';
      await this.saveState();
    }
  }
  async saveState() {
    const json = JSON.stringify(this.schedules, null, 2);
    await new Promise((resolve, reject) => {
      fs.writeFile('./jsondb/schedules.json', json, (err) =>
        err ? reject(err) : resolve(true),
      );
    });
  }
}
