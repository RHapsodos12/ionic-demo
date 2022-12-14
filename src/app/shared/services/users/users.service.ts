import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

const client = new PocketBase('http://127.0.0.1:8090');

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  async createUser(user: any) {
    // create user
    const newUser = await client.users.create({
      email: user.email,
      password: user.password,
      passwordConfirm: user.passwordConfirm,
    });

    this.sendVerificationMail(user.email);

    return newUser;
  }

  async sendVerificationMail(email: string) {
    // send verification email
    return await client.users.requestVerification(email);
  }

  async logIn(user: any) {
    const authData = await client.users.authViaEmail(user.email, user.password);
    return authData;
  }

  async requestPwdReset(email: string) {
    return await client.users.requestPasswordReset(email);
  }
}
