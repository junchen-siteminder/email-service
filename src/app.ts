'use strict';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as config from './config/config.json';
import { Email } from './models/Email';
import { EmailServiceError } from './models/EmailServiceError';
import { ReturnCode } from './models/ReturnCode';
import { EmailServiceProvider } from './services/EmailServiceProvider';

export let app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
    if(req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
      next();
    }
});

app.post('/send', (req, res) => {
  const email = new Email(req.body);
  const ret = email.validate();
  if(Object.keys(ret).length === 0) {
    const emailServiceProvider: EmailServiceProvider = new EmailServiceProvider(config.services);
    emailServiceProvider.send(email).then(() => {
      res.status(ReturnCode.SUCCESS).send({message: 'Email is successfully accepted.'});
    }).catch((err: EmailServiceError) => {
      res.status(err.code).send(err);
    });
  } else {
    res.status(ReturnCode.BAD_REQUEST).send(ret);
  }
});

