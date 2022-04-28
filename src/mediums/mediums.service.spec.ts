import { Test, TestingModule } from '@nestjs/testing';
import assert = require('assert');
import { UsersService } from '../users/users.service';
import { MediumsService } from './mediums.service';

describe('MediumsService', () => {
  let service: MediumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediumsService, UsersService],
    }).compile();

    service = module.get<MediumsService>(MediumsService);
  });

  it('Only accepts valid medium ids', () => {
    expect(service.validateMediumId('something')).toBe(false);
  });
  it('Can Send SMS Notification', (done) => {
    const mediumId = 'sms';
    const message = 'Hello World';
    const userId = 'able-short-lawyer';
    MediumsService.interceptor.addListener('notification', (arg) => {
      try {
        assert(arg.detail.mediumId === mediumId);
        assert(arg.detail.message === message);
        assert(arg.detail.userId === userId);
        done();
      } catch (e) {
        done(e);
      }
    });
    service.sendNotification(mediumId, userId, message);
  });
});
