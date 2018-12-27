import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuarios';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacaoService } from '../../compartilhado/mensagens/notificacao.service';
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
  selector: 'app-perfil-escola',
  templateUrl: './perfil-escola.component.html',
  styleUrls: ['./perfil-escola.component.scss']
})
export class PerfilEscolaComponent implements OnInit {
  
  usuario: Usuario = this._auth.getCurrentUser();
  edicao: boolean = false;
  perfil: any;
  isWait = false;

  redes: string[] = ['Municipal', 'Estadual', 'Federal'];
  etapas: string[] = ['Infantil', 'Fundamental', 'Médio', 'Técnico', 'Superior'];
  selectedUF = '';
  estados: UF[] = [
    {value: 'RS', viewValue: 'Rio Grande do Sul'},
    {value: 'SC', viewValue: 'Santa Catarina'},
    {value: 'CE', viewValue: 'Ceará'}
  ];
  
  selectedCidade = '';
  cidades: Cidade[] = [
    {value: 'Charqueadas', viewValue: 'Charqueadas'},
    {value: 'São Jerônimo', viewValue: 'São Jerônimo'},
    {value: 'Porto Alegre', viewValue: 'Porto Alegre'}
  ];

  atualizaEscolaForm = this.fb.group({
    nome: ['', Validators.required],
    sobre: ['', Validators.required],    
    rede: ['', Validators.required],
    etapa: ['', Validators.required],
    endereco: this.fb.group({
      logradouro: ['', Validators.required], 
      numero: ['', Validators.required],
      bairro: ['', Validators.required], 
      cidade: ['', Validators.required], 
      uf: ['', Validators.required]
    })
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private _auth: AuthService,
              private _usuarios: UsuariosService,
              private _notif: NotificacaoService) { }

  ngOnInit() {
    this.exibePerfil(this.usuario.userId);
  }

  editar(perfil) {
    this.edicao = true;
    var etapas = perfil.etapa.split(',');
    this.atualizaEscolaForm = this.fb.group({
      nome: [perfil.nome, Validators.required],
      sobre: [perfil.sobre, Validators.required],    
      rede: [perfil.rede, Validators.required],
      etapa: [etapas, Validators.required],
      endereco: this.fb.group({
        logradouro: [perfil.endereco.logradouro, Validators.required], 
        numero: [perfil.endereco.numero, Validators.required],
        bairro: [perfil.endereco.bairro, Validators.required], 
        cidade: [perfil.endereco.cidade, Validators.required], 
        uf: [perfil.endereco.uf, Validators.required]
      })
    });
  }

  cancelarEdicao() {
    this.edicao = false;
  }

  exibePerfil(userId) {
    this._usuarios.getUsuario(userId)
      .subscribe(
        usuario => this.perfil = usuario,
        response => console.log(response.error.message)
      );
  }

  atualizaPerfil(model: any, isValid: boolean, e: any){
    e.preventDefault();
    if (isValid){
      this.isWait = true;
      this._usuarios.updateUsuario(this.usuario.userId, model)
        .subscribe(
          res => {
            this.exibePerfil(this.usuario.userId);
            this.isWait = false;
            this.cancelarEdicao();
            this._notif.notifica('Perfil atualizado!');
          },
          err => {
            this.isWait = false;
            this._notif.notifica('Erro ao atualizar perfil');
          }
        );
    }
  }

}
