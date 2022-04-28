import { Test, TestingModule } from '@nestjs/testing';
import { generateSlug } from 'random-word-slugs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleDTO } from './DTO/schedule.dto';
import { MediumsService } from './mediums/mediums.service';
import { SchedulerService } from './scheduler/scheduler.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, MediumsService, SchedulerService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('Does not schedules when userId is not valid', async () => {
      const payload = {
        mediumId: 'sms',
        userId: generateSlug(),
        message: 'Hi there',
        cronString: '* * * * * *',
      } as unknown as ScheduleDTO;
      const response = await appController.scheduleNotification(payload);
      expect(response.scheduled).toBe(false);
    });
  });
});
