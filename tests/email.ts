import { expect } from 'chai';
import 'mocha';
import * as supertest from 'supertest';
import {app} from '../src/app';
import * as config from '../src/config/config.json';
import { Email } from '../src/models/Email';
import { EmailAddress } from '../src/models/EmailAddress';
import { EmailServiceProvider } from '../src/services/EmailServiceProvider';
import { MailGunEmailService } from '../src/services/MailGunEmailService';
import { SendGridEmailService } from '../src/services/SendGridEmailService';

const request = supertest(app);

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

const from = new EmailAddress({email: 'info@sandbox1b688632debc42429d34e8ce767e0189.mailgun.org', name: 'Frank Chen'});
const sendGridFrom = new EmailAddress({email: 'frankchenjun@me.com', name: 'Frank Chen'});

const to1 = new EmailAddress({email: 'frank.chenjun@gmail.com', name: 'Jun Chen'});

const to2 = new EmailAddress({email: 'frankchenjun@me.com', name: 'Jun Chen'});

const cc1 = new EmailAddress({email: 'frank.chenjun+3000@gmail.com', name: 'Jun Chen3000'});

const cc2 = new EmailAddress({email: 'frank.chenjun+4000@gmail.com', name: 'Jun Chen4000'});

const bcc1 = new EmailAddress({email: 'frank.chenjun+2000@gmail.com', name: 'Jun Chen2000'});


const invalidEmailAddress = new EmailAddress({email: 'frank_#chen.gmail.com', name:'Jun Chen Invalid'});

const missingEmailAddress = new EmailAddress({email: '', name: 'Missing Email'});

const subject = 'test email subject';

const textBody = 'test text body';

describe('send', () => {
  it('expect errors for all required fields when request body is empty', (done) => {
    request.post('/send').send({}).expect(400).end((err, result) => {
      expect(result.body.from).equals('Email is required');
      done(err);
    });
  });

  it('expect errors when from is empty', (done) => {
    request.post('/send').send({
      to: [to1, to2],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.from).equals('Email is required');
      done(err);
    });
  });

  it('expect errors when to is empty', (done) => {
    request.post('/send').send({
      from,
      cc: [to1, to2],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.to).equals('recipient is required.');
      done(err);
    });
  });

  it('expect errors when subject is empty', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, cc2],
      subject: '',
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.subject).equals('Subject is required.');
      done(err);
    });
  });

  it('expect errors when subject is null', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, cc2],
      subject: null,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.subject).equals('Subject is required.');
      done(err);
    });
  });

  it('expect errors when subject is undefined', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, cc2],
      subject: undefined,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.subject).equals('Subject is required.');
      done(err);
    });
  });

  it('expect errors when text body and html body are empty', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, cc2],
      subject
    }).expect(400).end((err, result) => {
      expect(result.body.body).equals('Either text body or html body must be provided.');
      done(err);
    });
  });

  it('expect errors when to has invalid email address', (done) => {
    request.post('/send').send({
      from,
      to: [to1, invalidEmailAddress],
      cc: [cc1, cc2],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.to).equals('Invalid email format');
      done(err);
    });
  });

  it('expect errors when to misses email address', (done) => {
    request.post('/send').send({
      from,
      to: [to1, missingEmailAddress],
      cc: [cc1, cc2],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.to).equals('Email is required');
      done(err);
    });
  });

  it('expect errors when cc has invalid email address', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, invalidEmailAddress],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.cc).equals('Invalid email format');
      done(err);
    });
  });

  it('expect errors when cc misses email address', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, missingEmailAddress],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.cc).equals('Email is required');
      done(err);
    });
  });

  it('expect errors when bcc has invalid email address', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, cc2],
      bcc: [bcc1, invalidEmailAddress],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.bcc).equals('Invalid email format');
      done(err);
    });
  });

  it('expect errors when bcc misses email address', (done) => {
    request.post('/send').send({
      from,
      to: [to1],
      cc: [cc1, cc2],
      bcc: [bcc1, missingEmailAddress],
      subject,
      textBody
    }).expect(400).end((err, result) => {
      expect(result.body.bcc).equals('Email is required');
      done(err);
    });
  });

  it('expect success when sending email from mailgun', (done) => {
    const emailServiceProvider: EmailServiceProvider = new EmailServiceProvider(config.services);
    const email = new Email({
      from,
      to: [to1, to2],
      cc: [cc1, cc2],
      bcc: [bcc1],
      subject,
      textBody
    });
    emailServiceProvider.send(email, MailGunEmailService).then((value) => {
      expect(value).equals(true);
      done(null);
    }).catch(err => {
      done(err);
    })
  });

  it('expect success when sending email from sendgrid', (done) => {
    const emailServiceProvider: EmailServiceProvider = new EmailServiceProvider(config.services);
    const email = new Email({
      from: sendGridFrom,
      to: [to1, to2],
      cc: [cc1, cc2],
      bcc: [bcc1],
      subject,
      textBody
    });
    emailServiceProvider.send(email, SendGridEmailService).then((value) => {
      expect(value).equals(true);
      done(null);
    }).catch(err => {
      done(err);
    })
  });
});

