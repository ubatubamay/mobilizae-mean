import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacaoService } from '../compartilhado/mensagens/notificacao.service';

export interface UF {
  value: string;
  viewValue: string;
}

export interface Cidade {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sou-uma-escola',
  templateUrl: './sou-uma-escola.component.html',
  styleUrls: ['./sou-uma-escola.component.scss']
})
export class SouUmaEscolaComponent implements OnInit {

  hide = true;
  isWait: Boolean = false;

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
    {value: 'ch', viewValue: 'Charqueadas'},
    {value: 'sj', viewValue: 'São Jerônimo'},
    {value: 'poa', viewValue: 'Porto Alegre'}
  ];

  cadastroEscolaForm = this.fb.group({
    perfil: ['escola'],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    nome: ['', Validators.required],
    sobre: [''],
    logradouro: ['', Validators.required], 
    numero: ['', Validators.required],
    bairro: ['', Validators.required], 
    cidade: ['', Validators.required], 
    uf: ['', Validators.required],
    rede: ['', Validators.required],
    etapa: [[''], Validators.required]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private _usuarios: UsuariosService,
              private _notif: NotificacaoService) { }

  ngOnInit() {
  }

  cadastraUsuario(model: any, isValid: boolean, e: any) {
    model.perfil = 'escola';
    e.preventDefault();
    if (isValid){
      this.isWait = true;
      this._usuarios.cadastraUsuario(model)
        .subscribe(
          res => {
            this.router.navigate(['/']).then(()=>{
              this.isWait = false;
              this._notif.notifica('Escola cadastrada com sucesso');
            });            
          },
          err => {
            this.isWait = false;
            this._notif.notifica('O e-mail informado já tem cadastro');
          }
        );
    }
  }
}
