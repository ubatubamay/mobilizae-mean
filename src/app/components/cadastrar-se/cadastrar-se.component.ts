import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacaoService } from '../compartilhado/mensagens/notificacao.service';
import { Router } from '@angular/router';

export interface UF {
  value: string;
  viewValue: string;
}

export interface Cidade {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cadastrar-se',
  templateUrl: './cadastrar-se.component.html',
  styleUrls: ['./cadastrar-se.component.scss']
})
export class CadastrarSeComponent implements OnInit {

  isWait: Boolean = false;

  selectedUF = '';
  estados: UF[] = [
    {value: 'RS', viewValue: 'Rio Grande do Sul'},
    {value: 'SC', viewValue: 'Santa Catarina'},
    {value: 'CE', viewValue: 'Ceará'}
  ];
  selectedCidade = '';
  cidades: Cidade[] = [
    {value: 'ch', viewValue: 'Charqueadas'},
    {value: 'sj', viewValue: 'São Jerônimo'},
    {value: 'poa', viewValue: 'Porto Alegre'}
  ];

  cadastrarSeForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    nome: ['', Validators.required],
    sobrenome: ['', Validators.required],
    cpf: ['', Validators.required],
    data_nascimento: ['', Validators.required], 
    cidade: ['', Validators.required], 
    uf: ['', Validators.required]
  });

  constructor(public thisDiologRef: MatDialogRef<CadastrarSeComponent>,
              private fb: FormBuilder,
              private router: Router,
              private _usuarios: UsuariosService,
              private _notif: NotificacaoService) { }

  onCloseConfirm() {
    this.thisDiologRef.close('Confirm');
  }

  onCloseCancel() {
    this.thisDiologRef.close('Cancel');
  }

  cadastraUsuario(model: any, isValid: boolean, e: any) {
    model.perfil = 'cidadao';
    e.preventDefault();
    if (isValid){
      this.isWait = true;
      this._usuarios.cadastraUsuario(model)
        .subscribe(
          res => {
            this.onCloseCancel();
            this.router.navigate(['/']).then(()=>{
              this.isWait = false;       
              this._notif.notifica('Usuário cadastrado com sucesso');
            });            
          },
          err => {
            this.isWait = false;
            this._notif.notifica('E-mail já cadastrado');
          }
        );
    }
  }

  ngOnInit() {
  }

}
