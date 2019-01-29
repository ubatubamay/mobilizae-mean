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
  selector: 'app-cidadaos',
  templateUrl: './cidadaos.component.html',
  styleUrls: ['./cidadaos.component.scss']
})
export class CidadaosComponent implements OnInit {

  isWait: boolean = false;
  edicao: boolean = false;
  perfil: boolean = false;
  usuario: Usuario;
  cidadao: any;


  estados: Estados[];
  selectedEstado: Estados;

  filtroCidades: Observable<string[]>;
  cidades: string[];

  displayedColumns: string[] = ['nome', 'sobrenome', 'cidade', 'acao'];
  dataSource: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  atualizaCidadaoForm = this.fb.group({
    nome: ['', Validators.required],
    sobrenome: ['', Validators.required],
    sobre: ['', Validators.required],
    cpf: [''],
    data_nascimento: [''],
    endereco: this.fb.group({
      logradouro: [''], 
      numero: [''],
      bairro: [''], 
      cidade: ['', Validators.required], 
      uf: ['', Validators.required]
    })
  });

  constructor(private fb: FormBuilder,
              private _usuarios: UsuariosService,
              private _notif: NotificacaoService,
              private _estados: EstadosService) { 
    this._usuarios.getCidadaos()
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

  deletarCidadao(idCidadao: string) {

  }

  editar(perfil) {

    this._estados.getEstados()
      .subscribe(
        res => {
          this.estados = res;  
          let result: Estados[] = this.estados.filter(option => option.sigla.indexOf(perfil.endereco.uf) === 0);
          this.selectedEstado = result[0];
          this.cidades = this.selectedEstado.cidades;
          this.atualizaCidadaoForm = this.fb.group({
            nome: [perfil.nome, Validators.required],
            sobrenome: [perfil.sobrenome, Validators.required],
            sobre: [perfil.sobre, Validators.required],
            cpf: [perfil.cpf],
            data_nascimento: [perfil.data_nascimento],
            endereco: this.fb.group({
              logradouro: [perfil.endereco.logradouro], 
              numero: [perfil.endereco.numero],
              bairro: [perfil.endereco.bairro], 
              cidade: [perfil.endereco.cidade, Validators.required], 
              uf: [this.selectedEstado, Validators.required]
            })
          });

          this.filtroCidades = this.atualizaCidadaoForm.get('endereco').get('cidade').valueChanges
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

  exibePerfil(perfilId) {
    this._usuarios.getUsuario(perfilId)
      .subscribe(
        cidadao => {this.cidadao = cidadao; this.perfil = true},
        response => console.log(response.error.message)
      );
  }

  atualizaPerfil(model: any, isValid: boolean, e: any){
    e.preventDefault();
    model.endereco.uf = model.endereco.uf.sigla;
    if (isValid){
      this.isWait = true;
      this._usuarios.updateUsuario(this.cidadao._id, model)
        .subscribe(
          res => {
            this.exibePerfil(this.cidadao._id);
            this.isWait = false;
            this.cancelarEdicao();
            this._notif.notifica('Perfil atualizado!');
            this.ngOnInit();
          },
          err => {
            this.isWait = false;
            this._notif.notifica('Erro ao atualizar cidadão');
          }
        );
    }
  }
  
  // FUNÇÕES ESTADOS

  selecionado(estado) {
    this.selectedEstado = estado;
    this.atualizaCidadaoForm.get('endereco').get('cidade').setValue('');
    this.cidades = this.selectedEstado.cidades;
  }


  // FUNÇÕES CIDADES

  private _filterCidades(name: string): string[]{
    const filterValue = name.toLowerCase();
    return this.cidades.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
