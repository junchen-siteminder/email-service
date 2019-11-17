import { MailGunEmailService } from './MailGunEmailService';
import { SendGridEmailService } from './SendGridEmailService';

export class EmailServiceFactory {

  public static getEmailService(name: string, config: any): MailGunEmailService | SendGridEmailService {
    let service: MailGunEmailService | SendGridEmailService = null;
    switch (name) {
      case 'mailgun':
        service = new MailGunEmailService(config);
        break;
      case 'sendgrid':
        service = new SendGridEmailService(config);
        break;
      default:
        break;
    }
    return service;
  }
}