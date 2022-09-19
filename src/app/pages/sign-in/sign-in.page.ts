import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.signInForm = this.formBuilder.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  async signIn() {
    let logIn = await this.userService
      .logIn(this.signInForm.value)
      .catch(async (err) => {
        let alert = <Alert>{};
        alert.header = 'No se pudo iniciar sesión';
        alert.message = `${err.data.message} Do you have an account?`;
        await this.presentAlert(alert);
      });
    if (logIn) {
      this.router.navigate(['/tabs']);
    }
  }

  async signUp() {
    console.log('Up', this.signInForm.controls.email.value);
    let user = <User>{};
    user.email = this.signInForm.controls.email.value;
    user.password = this.signInForm.controls.password.value;
    user.passwordConfirm = this.signInForm.controls.password.value;

    let alert = <Alert>{};

    let createUser = (await this.userService
      .createUser(user)
      .catch(async (err) => {
        console.log('ERROR', err.data);
        alert.header = 'Error al crear usuario';
        alert.message = `${err.data.data.email.message}`;

        await this.presentAlert(alert);
        return;
      })) as any;

    if (createUser.id) {
      alert.header = 'Usuario Creado';
      alert.message = `Id: ${createUser.id}`;

      this.presentAlert(alert).then(() => {
        this.signInForm.reset();
      });
    }

    console.log('Created User', createUser);
  }

  async presentAlert(alert: Alert) {
    const _alert = await this.alertController.create({
      header: alert.header,
      subHeader: alert.subHeader,
      message: alert.message,
      buttons: ['OK'],
    });

    await _alert.present();
  }
}

export interface User {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface Alert {
  header: string;
  subHeader: string;
  message: string;
}
