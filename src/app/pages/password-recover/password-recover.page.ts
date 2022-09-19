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
  selector: 'app-password-recover',
  templateUrl: './password-recover.page.html',
  styleUrls: ['./password-recover.page.scss'],
})
export class PasswordRecoverPage implements OnInit {
  pwdRecoverForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.pwdRecoverForm = this.formBuilder.group({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  async PwdRecover() {
    let response = await this.userService.requestPwdReset(
      this.pwdRecoverForm.controls.email.value
    );
    const _alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      subHeader: 'Se ha enviado un correo',
      message:
        'Si la dirección está registrada recibirás un correo con instrucciones',
      buttons: ['OK'],
    });
    await _alert.present().then(() => {
      this.pwdRecoverForm.reset();
    });
  }

  signIn() {
    this.router.navigate(['/']);
  }
}
