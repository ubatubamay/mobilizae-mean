import { Component, OnInit } from '@angular/core';
import { CampanhasService } from 'src/app/services/campanhas.service';
import { Router } from '@angular/router';
import { Campanhas } from 'src/app/models/campanhas';
import { Observable } from 'rxjs';
import { Estados } from 'src/app/models/estados';
import { FormBuilder } from '@angular/forms';
import { NotificacaoService } from '../compartilhado/mensagens/notificacao.service';
import { EstadosService } from 'src/app/services/estados.service';
import { startWith, map } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuarios';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-campanhas',
  templateUrl: './campanhas.component.html',
  styleUrls: ['./campanhas.component.scss']
})
export class CampanhasComponent implements OnInit {

  isWait: Boolean = false;

  filtroEstados: Observable<Estados[]>;
  estados: Estados[];
  selectedEstado: Estados;

  filtroCidades: Observable<string[]>;
  cidades: string[];

  filtroEscolas: Observable<Usuario[]>;
  escolas: Usuario[];

  buscaCampanhaForm = this.fb.group({
    escola: [''],
    endereco: this.fb.group({
      cidade: [''], 
      uf: [null]
    })
  });

  campanhas = [];
  campanhasExibidas = [];
  constructor(public _campanhas: CampanhasService,
              private router: Router,
              private fb: FormBuilder,
              private _notif: NotificacaoService,
              private _estados: EstadosService,
              private _usuarios: UsuariosService) { }

  ngOnInit() {
    this._campanhas.getCampanhas()
      .subscribe(
        res => {this.campanhas = res;this.campanhasExibidas = res;},
        err => console.log(err)
      );

    

    this.buscaCampanhaForm.get('endereco').get('cidade').disable();

    this._estados.getEstados()
      .subscribe(
        res => this.estados = res,
        err => console.log(err)
      );

    this._usuarios.getEscolas()
      .subscribe(
        res => this.escolas = res,
        err => console.log(err)
      );

    this.filtroEscolas = this.buscaCampanhaForm.get('escola').valueChanges
      .pipe(
        startWith<string | Usuario>(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(name => name ? this._filterEscolas(name) : [])
      );

    this.filtroCidades = this.buscaCampanhaForm.get('endereco').get('cidade').valueChanges
      .pipe(
        startWith<string>(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this._filterCidades(name) : [])
      );
  }

  getCampanha(campanha: Campanhas) {
    this._campanhas.campanhaSelecionada = campanha;
    this.router.navigate(['/campanha/' + campanha._id ]);
  }

  // FUNÇÕES ESTADOS

  selecionado(estado) {
    this.selectedEstado = estado;
    this.buscaCampanhaForm.get('endereco').get('cidade').setValue('');
    this.buscaCampanhaForm.get('endereco').get('cidade').enable();
    this.cidades = this.selectedEstado.cidades;
  }


  // FUNÇÕES CIDADES

  private _filterCidades(name: string): string[]{
    const filterValue = name.toLowerCase();
    return this.cidades.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  // FUNÇÕES ESCOLAS

  displayFnEscola(escola?: Usuario): string | undefined {
    return escola ? escola.nome : undefined;
  }

  private _filterEscolas(name: string): Usuario[] {
    const filterValue = name.toLowerCase();

    return this.escolas.filter(option => option.nome.toLowerCase().indexOf(filterValue) === 0);
  }

  onSelectEscola(estado) {
    this.selectedEstado = estado;
    this.buscaCampanhaForm.get('endereco').get('cidade').setValue('');
    this.buscaCampanhaForm.get('endereco').get('cidade').enable();
    this.cidades = this.selectedEstado.cidades;
  }



  // FUNÇÕES BUSCA

  buscaCampanha(model: any, e: any){

    var conditions = [];

    // Dynamically build the list of conditions
    if(model.escola) {
      model.escola = model.escola._id;
       conditions.push(campanha => { 
          return campanha.escola._id == model.escola;
       });
    };
   
    if(model.endereco.uf) {
      model.endereco.uf = model.endereco.uf.sigla;
       conditions.push(campanha => { 
          return campanha.escola.endereco.uf == model.endereco.uf;
       });
    };

    if(model.endereco.cidade) {
       conditions.push(campanha => { 
          return campanha.escola.endereco.cidade == model.endereco.cidade;
       });
    };

    this.campanhasExibidas = this.campanhas.filter(campanha => {
        return conditions.every(function(condicao) {
            return condicao(campanha);
        });
    });

  }

  limparFiltro() {
    this.buscaCampanhaForm.get('escola').setValue('');
    this.buscaCampanhaForm.get('endereco').get('uf').setValue('');
    this.buscaCampanhaForm.get('endereco').get('cidade').setValue('');
    this.campanhasExibidas = this.campanhas;
    console.log('limpar');
  }

}
