export default interface ScheduleInterface {
  id: string;
  mediumId: string;
  message: string;
  userId: string;
  cronString: string;
  status: 'unintiated' | 'scheduled' | 'stopped';
  instance: undefined | number;
}
