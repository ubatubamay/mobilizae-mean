import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuarios';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacaoService } from '../../compartilhado/mensagens/notificacao.service';
import { Router } from '@angular/router';
import { Estados } from 'src/app/models/estados';
import { Observable } from 'rxjs';
import { EstadosService } from 'src/app/services/estados.service';
import { startWith, map } from 'rxjs/operators';

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

  estados: Estados[];
  selectedEstado: Estados;

  filtroCidades: Observable<string[]>;
  cidades: string[];

  redes: string[] = ['Municipal', 'Estadual', 'Federal'];
  etapas: string[] = ['Infantil', 'Fundamental', 'Médio', 'Técnico', 'Superior'];

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
              private _notif: NotificacaoService,
              private _estados: EstadosService) { }

  ngOnInit() {
    this.exibePerfil(this.usuario.userId);
  }

  editar(perfil) {

    this._estados.getEstados()
      .subscribe(
        res => {
          this.estados = res;  
          let result: Estados[] = this.estados.filter(option => option.sigla.indexOf(perfil.endereco.uf) === 0);
          this.selectedEstado = result[0];
          this.cidades = this.selectedEstado.cidades;
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
              uf: [this.selectedEstado, Validators.required]
            })
          });

          this.filtroCidades = this.atualizaEscolaForm.get('endereco').get('cidade').valueChanges
            .pipe(
              startWith<string>(''),
              map(value => typeof value === 'string' ? value : value),
              map(name => name ? this._filterCidades(name) : [])
            );
        },
        err => console.log(err)
      );

    this.edicao = true;
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
    model.endereco.uf = model.endereco.uf.sigla;
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

  // FUNÇÕES ESTADOS

  selecionado(estado) {
    this.selectedEstado = estado;
    this.atualizaEscolaForm.get('endereco').get('cidade').setValue('');
    this.cidades = this.selectedEstado.cidades;
  }


  // FUNÇÕES CIDADES

  private _filterCidades(name: string): string[]{
    const filterValue = name.toLowerCase();
    return this.cidades.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
