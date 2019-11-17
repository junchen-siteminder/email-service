import * as https from 'https';
import { Email } from '../models/Email';
import { BaseEmailService } from './BaseEmailService';
import { EmailServiceError } from '../models/EmailServiceError';

export class MailGunEmailService extends BaseEmailService {
  private readonly domain = null;

  constructor(config: any) {
    super(config);
    this.domain = config.domain;
  }

  public send(email: Email): Promise<boolean> {
    const options = this.createOptions();
    const body = this.formBody(email);
    options.headers['Content-Length'] = Buffer.byteLength(body);
    return this.sendEmail(options, body);
  }

  private createOptions() {
    const options = {
      hostname: this.host,
      port: 443,
      path: '/' + this.version + '/' + this.domain + '/' + this.path,
      method: 'POST',
      auth: 'api:' + this.apiKey,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return options;
  }

  private formBody(email: Email) {
    const body = [];
    body.push('from=' + encodeURIComponent(email.from.format()));
    body.push('to=' + encodeURIComponent(email.formatMultipleEmails(email.to)));
    if(email.cc.length > 0) {
      body.push('cc=' + encodeURIComponent(email.formatMultipleEmails(email.cc)));
    }
    if(email.bcc.length > 0) {
      body.push('bcc=' + encodeURIComponent(email.formatMultipleEmails(email.bcc)));
    }
    body.push('subject=' + encodeURIComponent(email.subject));
    if(email.textBody && email.textBody.length > 0) {
      body.push('text=' + encodeURIComponent(email.textBody));
    }
    if(email.htmlBody && email.htmlBody.length > 0) {
      body.push('text=' + encodeURIComponent(email.htmlBody));
    }
    return body.join('&');
  }
}