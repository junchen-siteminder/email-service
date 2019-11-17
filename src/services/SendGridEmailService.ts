import { Email } from '../models/Email';
import { BaseEmailService } from './BaseEmailService';

export class SendGridEmailService extends BaseEmailService {
  private host = null;
  private version = null;
  private path = null;
  private apiKey = null;

  constructor(config: any) {
    super();
    this.host = config.host;
    this.version = config.version;
    this.path = config.path;
    this.apiKey = config.apiKey;
  }

  public send(email: Email) {
    const options = this.createOptions();
    const body = this.formatBody(email);
    return this.sendEmail(options, body);
  }

  private formatBody(email: Email) {
    const body = {
      personalizations: [],
      from: email.from,
      content: []
    };
    const personalization: any = {
      to: email.to,
      subject: email.subject,
    };
    if(email.cc.length > 0) {
      personalization.cc = email.cc;
    }
    if(email.bcc.length > 0) {
      personalization.bcc = email.bcc;
    }
    body.personalizations.push(personalization);
    if(email.textBody) {
      body.content.push({type: "text/plain", value: email.textBody});
    }
    if(email.htmlBody) {
      body.content.push({type: "text/html", value: email.htmlBody});
    }
    return JSON.stringify(body);
  }



  private createOptions() {
    const options = {
      hostname: this.host,
      port: 443,
      path: '/' + this.version + '/' + this.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.apiKey
      }
    };
    return options;
  }
}