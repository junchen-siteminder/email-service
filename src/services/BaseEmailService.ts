import * as https from "https";
import { Email } from '../models/Email';
import { EmailServiceError } from '../models/EmailServiceError';
import { ReturnCode } from '../models/ReturnCode';

export abstract class BaseEmailService {
  protected host = null;
  protected version = null;
  protected apiKey = null;
  protected path = null;

  protected constructor(config) {
    this.host = config.host;
    this.version = config.version;
    this.path = config.path;
    this.apiKey = config.apiKey;
  }
  public abstract send(email: Email): Promise<boolean>;
  protected sendEmail(options: any, body: string): Promise<boolean> {
    const promise = new Promise<boolean>(((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.debug("http request returns " + res.statusCode + ': ' + res.statusMessage);
        if(res.statusCode >= 400) {
          reject(new EmailServiceError(res.statusCode, res.statusMessage));
        } else {
          resolve(true);
        }
      });
      req.on('error', (e) => {
        reject(new EmailServiceError(ReturnCode.SERVER_ERROR, e.message));
      });
      req.end(body);
    }));
    return promise;
  }
}