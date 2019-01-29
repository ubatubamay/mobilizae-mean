import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Validators, FormBuilder } from '@angular/forms';
import { NotificacaoService } from '../../compartilhado/mensagens/notificacao.service';
import { EstadosService } from 'src/app/services/estados.service';
import { Estados } from 'src/app/models/estados';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-escolas',
  templateUrl: './escolas.component.html',
  styleUrls: ['./escolas.component.scss']
})
export class EscolasComponent implements OnInit {

  isWait: boolean = false;
  edicao: boolean = false;
  perfil: boolean = false;
  usuario: Usuario;
  escola: any;


  estados: Estados[];
  selectedEstado: Estados;

  filtroCidades: Observable<string[]>;
  cidades: string[];

  redes: string[] = ['Municipal', 'Estadual', 'Federal'];
  etapas: string[] = ['Infantil', 'Fundamental', 'Médio', 'Técnico', 'Superior'];

  displayedColumns: string[] = ['escola', 'rede', 'cidade', 'acao'];
  dataSource: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  constructor(private _usuarios: UsuariosService,
              private fb: FormBuilder,
              private _notif: NotificacaoService,
              private _estados: EstadosService) { 
    this._usuarios.getEscolas()
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        err => console.log(err)
      );
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletarEscola(idEscola: string) {

  }

  editar(escola) {

    this._estados.getEstados()
      .subscribe(
        res => {
          this.estados = res;  
          let result: Estados[] = this.estados.filter(option => option.sigla.indexOf(escola.endereco.uf) === 0);
          this.selectedEstado = result[0];
          this.cidades = this.selectedEstado.cidades;
          var etapas = escola.etapa.split(',');
          this.atualizaEscolaForm = this.fb.group({
            nome: [escola.nome, Validators.required],
            sobre: [escola.sobre, Validators.required],    
            rede: [escola.rede, Validators.required],
            etapa: [etapas, Validators.required],
            endereco: this.fb.group({
              logradouro: [escola.endereco.logradouro, Validators.required], 
              numero: [escola.endereco.numero, Validators.required],
              bairro: [escola.endereco.bairro, Validators.required], 
              cidade: [escola.endereco.cidade, Validators.required], 
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

  exibePerfil(escolaId) {
    this._usuarios.getUsuario(escolaId)
      .subscribe(
        escola => {this.escola = escola; this.perfil = true},
        response => console.log(response.error.message)
      );
  }

  atualizaPerfil(model: any, isValid: boolean, e: any){
    e.preventDefault();
    model.endereco.uf = model.endereco.uf.sigla;
    if (isValid){
      this.isWait = true;
      this._usuarios.updateUsuario(this.escola._id, model)
        .subscribe(
          res => {
            this.exibePerfil(this.escola._id);
            this.isWait = false;
            this.cancelarEdicao();
            this._notif.notifica('Perfil atualizado!');
            this.ngOnInit();
          },
          err => {
            this.isWait = false;
            this._notif.notifica('Erro ao atualizar escola');
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
