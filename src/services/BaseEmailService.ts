import * as https from "https";
import { Email } from '../models/Email';
import { EmailServiceError } from '../models/EmailServiceError';
import { ErrorCode } from '../models/ErrorCode';

export abstract class BaseEmailService {
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
        reject(new EmailServiceError(ErrorCode.SERVER_ERROR, e.message));
      });
      req.end(body);
    }));
    return promise;
  }
}