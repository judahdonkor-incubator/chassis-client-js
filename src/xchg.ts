import { Rs } from '.';
import { Entity } from './crud';

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

class Exchanger {
  private rs: Rs;
  constructor(rs: Rs) {
    this.rs = rs;
  }
  token(tk: string): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.rs('tk')<Token, string>(tk)
        .then(rsp => {
          resolve(rsp);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  signOut(): Promise<void> {
    return this.rs('sign-out')();
  }
  signIn(
    credentials:
      | Pick<Credentials, 'email' | 'password'>
      | Pick<Credentials, 'email' | 'token'>
      | Pick<Credentials, 'phone' | 'password'>
      | Pick<Credentials, 'phone' | 'token'>
  ): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.rs('sign-in')<Token, typeof credentials>(credentials)
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
    return this.rs('otp')(credentials);
  }
  resetPassword(password: string): Promise<void> {
    return this.rs('rst-pwd')(password);
  }
}

export { Exchanger, AppUser, Token, Credentials, SignUpReq };
