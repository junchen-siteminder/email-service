export class EmailAddress {
  public email: string;
  public name: string;

  constructor(data: any) {
    this.email = data ? data.email : '';
    this.name = data ? data.name : '';
  }

  public validate(): boolean | string {
    if(this.email && this.email.length > 0) {
      // General Email Regex (RFC 5322 Official Standard)
      const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      return regex.test(this.email) ? true : 'Invalid email format';
    } else {
      return 'Email is required';
    }
  }

  public format(): string {
    if(this.name && this.name.length > 0) {
      return this.name + ' <' + this.email + '>';
    } else {
      return this.email;
    }
  }
}