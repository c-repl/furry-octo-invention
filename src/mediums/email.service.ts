import { Logger } from '@nestjs/common';
import { assert } from 'console';
import { UsersService } from '../users/users.service';
import { Medium } from './medium';
import { MediumsService } from './mediums.service';

export class EmailService implements Medium {
  name = 'email';
  logger = new Logger('EmailService');
  constructor(public config: Record<string, any>) {}
  async send(message: string, userId: string): Promise<boolean> {
    assert(this.validateTarget(userId), 'Invalid userId');
    this.logger.debug(
      'Sent message through email',
      `message: ${message}`,
      userId,
    );
    const sent = Math.random() > 0.2;
    if (sent) {
      MediumsService.notificationInterceptor(this.name, message, userId);
    }
    return sent;
  }
  validateTarget(userId: string): boolean {
    const user = UsersService.getUser(userId);
    return Boolean(user.email && user.email.includes('@'));
  }
}
