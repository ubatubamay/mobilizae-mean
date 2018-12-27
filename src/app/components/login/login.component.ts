import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NotificacaoService } from '../compartilhado/mensagens/notificacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  isWait: Boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(public thisDiologRef: MatDialogRef<LoginComponent>,
              private fb: FormBuilder,
              private router: Router,
              private _auth: AuthService,
              private _notif: NotificacaoService) { }

  ngOnInit() { }

  onCloseConfirm() {
    this.thisDiologRef.close('Confirm');
  }

  onCloseCancel() {
    this.thisDiologRef.close('Cancel');
  }

  onLogin (model: any, isValid: boolean, e: any) {
    e.preventDefault();
    if (isValid){
      this.isWait = true;
      return this._auth.loginUser(this.loginForm.value)
        .subscribe(
          data => {
            this.isWait = false;
            this._auth.setUser(data.user);
            this._auth.setToken(data.user.token);
            this.isWait = false;
            this.onCloseCancel();
            location.reload();
            if (data.user.perfil === 'escola') {
              this.router.navigate(['/area-escola']);
            } else {
              this.router.navigate(['/area-cidadao']);
            }
          },
          error => {
            this.isWait = false;
            this._notif.notifica('Login inválido');
          }
      );
    }
  }

}
