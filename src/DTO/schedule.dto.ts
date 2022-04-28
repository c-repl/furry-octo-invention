import { generateSlug } from 'random-word-slugs';

export class ScheduleDTO {
  readonly status: 'unintiated';
  id: string;
  public mediumId: string;
  public message: string;
  public userId: string;
  public cronString: string;
  public instance: null;
  static init(schedule: ScheduleDTO) {
    schedule.id = generateSlug();
  }
}
