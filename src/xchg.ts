import { Entity } from './crud';
import { Resource } from './rs';

type AppUser = Entity & {
  person: Entity;
};

type Token = Entity & {
  appUser: AppUser;
  token: string;
};

type Credentials = Record<'email' | 'phone' | 'password' | 'token', string>;

type SignUpReq = Record<'email' | 'phone', string> & {
  appuser: AppUser;
};

class Exchange {
  private resource: Resource;
  constructor(resource: Resource) {
    this.resource = resource;
  }
  token(tk: string): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.resource('tk')<Token, string>(tk)
        .then(rsp => {
          resolve(rsp);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  signOut(): Promise<void> {
    return this.resource('sign-out')();
  }
  signIn(
    credentials:
      | Pick<Credentials, 'email' | 'password'>
      | Pick<Credentials, 'email' | 'token'>
      | Pick<Credentials, 'phone' | 'password'>
      | Pick<Credentials, 'phone' | 'token'>
  ): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.resource('sign-in')<Token, typeof credentials>(credentials)
        .then(rsp => {
          resolve(rsp);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  otp(
    credentials: Pick<Credentials, 'email'> | Pick<Credentials, 'phone'>
  ): Promise<void> {
    return this.resource('otp')(credentials);
  }
  resetPassword(password: string): Promise<void> {
    return this.resource('rst-pwd')(password);
  }
}

export { Exchange, AppUser, Token, Credentials, SignUpReq };
