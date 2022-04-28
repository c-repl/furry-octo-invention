import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { generateSlug } from 'random-word-slugs';
import { User } from './user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('create')
  async create(@Body() user: User): Promise<any> {
    user.id = generateSlug();
    this.userService.create(user).catch((e) => {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    });
    return { id: user.id };
  }
}
