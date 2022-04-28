import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediumsService } from './mediums/mediums.service';
import { SchedulerService } from './scheduler/scheduler.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, MediumsService, SchedulerService],
})
export class AppModule {}
