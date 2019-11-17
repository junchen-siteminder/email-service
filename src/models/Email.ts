import { EmailAddress } from './EmailAddress';

export class Email {
  public from: EmailAddress;
  public to: EmailAddress[];
  public cc: EmailAddress[];
  public bcc: EmailAddress[];
  public subject: string;
  public textBody: string;
  public htmlBody: string;


  constructor(data: any) {
    this.from = new EmailAddress(data.from);
    this.to = this.generateEmailAddresses(data.to);
    this.cc = this.generateEmailAddresses(data.cc);
    this.bcc = this.generateEmailAddresses(data.bcc);
    this.subject = data.subject;
    this.textBody = data.textBody;
    this.htmlBody = data.htmlBody;
  }

  public formatMultipleEmails(emailAddresses: EmailAddress[]) {
    const emails = [];
    emailAddresses.forEach(emailAddress => {
      emails.push(emailAddress.format());
    })
    return emails.join(',');
  }

  public validate(): any {
    let errors: any = {};
    errors = Object.assign(errors, this.validateEmail('from', this.from));
    if(this.to.length === 0) {
      errors.to = 'recipient is required.';
    } else {
      this.to.forEach(email => {
        errors = Object.assign(errors, this.validateEmail('to', email));
      }, this);
    }
    this.cc.forEach(email => {
      errors = Object.assign(errors, this.validateEmail('cc', email));
    }, this);
    this.bcc.forEach(email => {
      errors = Object.assign(errors, this.validateEmail('bcc', email));
    }, this);
    if(!this.subject || this.subject.length === 0) {
      errors.subject = 'Subject is required.';
    }
    if((!this.textBody || this.textBody.length === 0) && (!this.htmlBody || this.htmlBody.length === 0)) {
      errors.body = 'Either text body or html body must be provided.';
    }
    return errors;
  }

  private generateEmailAddresses(data: any[]) {
    const emails: EmailAddress[] = [];
    if(data && Array.isArray(data)) {
      data.forEach(recipient => {
        emails.push(new EmailAddress(recipient));
      })
    }
    return emails;
  }

  private validateEmail(field: string, email: EmailAddress): any {
    const errors = {};
    const ret = email.validate();
    if(ret !== true) {
      errors[field] = ret;
    }
    return errors;
  }

}