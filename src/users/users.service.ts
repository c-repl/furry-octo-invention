import { Injectable } from '@nestjs/common';
import { User } from './user';
import fs = require('fs');
import assert = require('assert');
@Injectable()
export class UsersService {
  static users: User[] = [];
  constructor() {
    const json = fs.readFileSync('jsondb/users.json', 'utf8');
    try {
      UsersService.users = JSON.parse(json);
    } catch (e) {}
  }
  validateUser(user: User): string | undefined {
    if (!(user.email && user.email.includes('@'))) {
      return `${user.email} is not a valid email`;
    } else if (!(user.phone && user.phone.length === 13)) {
      return `${user.phone} is not a valid phone number`;
    } else if (!(user.whatsapp && user.whatsapp.length === 13)) {
      return `${user.whatsapp} is not a valid whatsapp number`;
    } else if (!(user.slackId && user.slackId.includes('@slack'))) {
      return `${user.slackId} is not a valid slack id`;
    }
  }
  async create(user: User) {
    const validUserMessage = this.validateUser(user);
    assert(validUserMessage === undefined, validUserMessage);
    UsersService.users.push(user);
    await this.saveState();
  }
  static getUser(userId: string) {
    const user = UsersService.users.find((user) => user.id === userId);
    assert(user, new Error(`User ${userId} not found`));
    return user;
  }
  async saveState() {
    const json = JSON.stringify(UsersService.users, null, 2);
    await new Promise((resolve, reject) => {
      fs.writeFile('./jsondb/users.json', json, (err) =>
        err ? reject(err) : resolve(true),
      );
    });
  }
}
