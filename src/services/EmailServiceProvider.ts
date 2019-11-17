import { Email } from '../models/Email';
import { EmailServiceError } from '../models/EmailServiceError';
import { ErrorCode } from '../models/ErrorCode';
import { BaseEmailService } from './BaseEmailService';
import { EmailServiceFactory } from './EmailServiceFactory';

export class EmailServiceProvider {
  private readonly services: BaseEmailService[];

  constructor(config: any) {
    this.services = [];
    for(const key in config) {
      if(config.hasOwnProperty(key)) {
        const service = EmailServiceFactory.getEmailService(key, config[key]);
        if (service) {
          this.services.push(service);
        }
      }
    }
  }

  public async send(email: Email, serviceName = null) {
    let sent = false;
    for(const service of this.services) {
      if(serviceName !== null && !(service instanceof serviceName)) {
        continue;
      } else {
        try {
          await service.send(email);
          sent = true;
          break;
        } catch (err) {
          console.error(err.code + ': ' + err.message);
          if (err.code === ErrorCode.BAD_REQUEST) {
            throw err;
          } else {
            console.info("Switching to alternate email service provider");
          }
        }
      }
    }
    if(sent) {
      return sent;
    } else {
      throw new EmailServiceError(ErrorCode.SERVER_ERROR, 'Email service api is unavailable.');
    }
  }
}