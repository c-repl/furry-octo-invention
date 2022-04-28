import { Injectable, Logger } from '@nestjs/common';
import { Medium } from './medium';
import configs from './config';
import assert = require('assert');
import EventEmitter = require('events');

@Injectable()
export class MediumsService {
  static logger = new Logger('MediumsService');
  static interceptor = new EventEmitter();
  private mediums: Record<string, Medium> = {};
  private getMedium(mediumId: string): Medium {
    if (mediumId in this.mediums) {
      return this.mediums[mediumId];
    }
    const mediumConfig = configs[mediumId];
    if (!mediumConfig) {
      throw new Error(`Medium ${mediumId} not found`);
    }
    if ('enabled' in mediumConfig && !mediumConfig.enabled) {
      throw new Error(`Medium ${mediumId} is disabled`);
    }
    this.mediums[mediumId] = new mediumConfig.class(mediumConfig.config);
    return this.mediums[mediumId];
  }
  validateMediumId(mediumId: string): boolean {
    return mediumId in configs;
  }
  validateTarget(mediumId: string, userId: string): boolean {
    return this.getMedium(mediumId).validateTarget(userId);
  }
  /**
   * This is to allow testing of the notification
   */
  static notificationInterceptor(
    mediumId: string,
    message: string,
    userId: string,
  ) {
    this.logger.debug(`message intercepted: ${message}`);
    this.interceptor.emit('notification', {
      detail: {
        mediumId,
        message,
        userId,
      },
    });
  }
  async sendNotification(
    mediumId: string,
    userId: string,
    message: string,
    attemt = 0,
  ) {
    const medium = this.getMedium(mediumId);
    const sent = await medium.send(message, userId);
    if (
      !sent &&
      configs[mediumId].retries &&
      attemt < configs[mediumId].retries
    ) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            this.sendNotification(mediumId, userId, message, attemt + 1).catch(
              reject,
            ),
          );
        }, configs[mediumId].retryInterval || 5000);
      });
    } else {
      assert(sent, 'Notification not sent');
    }
  }
}
