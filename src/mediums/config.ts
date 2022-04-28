import { EmailService } from './email.service';
import { MediumConfig } from './medium';
import { SlackService } from './slack.service';
import { SMSService } from './sms.service';
import { WhatsappService } from './whatsapp.service';

const configs: Record<string, MediumConfig> = {
  sms_international: {
    enabled: false,
    class: SMSService,
    config: {
      api_key: '0x827398dgh23',
      sender: '+92382734234',
    },
  },
  whatsapp: {
    class: WhatsappService,
    config: {
      key: '--0x--',
    },
  },
  slack: {
    class: SlackService,
    config: {
      key: '--0x--',
    },
  },
  email: {
    class: EmailService,
    config: {
      email: 'email@sender.com',
      token: '0x8273982d8abcd9823',
    },
  },
  sms: {
    class: SMSService,
    config: {
      smsCenter: '+919334234234',
      token: '0x8273982d8abcd9823',
    },
  },
};
export default configs;
