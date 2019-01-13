import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacaoService } from '../compartilhado/mensagens/notificacao.service';
import { Router } from '@angular/router';
import { switchMap, debounceTime, startWith, map } from 'rxjs/operators';
import { EstadosService } from 'src/app/services/estados.service';
import { Estados } from 'src/app/models/estados';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cadastrar-se',
  templateUrl: './cadastrar-se.component.html',
  styleUrls: ['./cadastrar-se.component.scss']
})
export class CadastrarSeComponent implements OnInit {

  hide = true;
  isWait: Boolean = false;

  filtroEstados: Observable<Estados[]>;
  estados: Estados[];
  selectedEstado: Estados;

  filtroCidades: Observable<string[]>;
  cidades: string[];

  cadastrarSeForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    nome: ['', Validators.required],
    sobrenome: ['', Validators.required],
    cpf: ['', Validators.required],
    data_nascimento: ['', Validators.required], 
    cidade: ['', Validators.required], 
    uf: [null, Validators.required]
  });

  constructor(public thisDiologRef: MatDialogRef<CadastrarSeComponent>,
              private fb: FormBuilder,
              private router: Router,
              private _usuarios: UsuariosService,
              private _notif: NotificacaoService,
              private _estados: EstadosService) { }

  onCloseConfirm() {
    this.thisDiologRef.close('Confirm');
  }

  onCloseCancel() {
    this.thisDiologRef.close('Cancel');
  }

  cadastraUsuario(model: any, isValid: boolean, e: any) {
    model.perfil = 'cidadao';
    model.uf = model.uf.sigla;
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

    this.cadastrarSeForm.get('cidade').disable();

    this._estados.getEstados()
      .subscribe(
        res => this.estados = res,
        err => console.log(err)
      );

    this.filtroEstados = this.cadastrarSeForm.get('uf').valueChanges
      .pipe(
        startWith<string | Estados>(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(name => name ? this._filter(name) : [])
      );

    this.filtroCidades = this.cadastrarSeForm.get('cidade').valueChanges
      .pipe(
        startWith<string>(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this._filterCidades(name) : [])
      );
  }

  // FUNÇÕES ESTADOS

  displayFn(estado?: Estados): string | undefined {
    return estado ? estado.nome : undefined;
  }

  private _filter(name: string): Estados[] {
    const filterValue = name.toLowerCase();

    return this.estados.filter(option => option.nome.toLowerCase().indexOf(filterValue) === 0);
  }

  selecionado(estado) {
    this.selectedEstado = estado;
    this.cadastrarSeForm.get('cidade').setValue('');
    this.cadastrarSeForm.get('cidade').enable();
    this.cidades = this.selectedEstado.cidades;
  }


  // FUNÇÕES CIDADES

  private _filterCidades(name: string): string[]{
    const filterValue = name.toLowerCase();
    return this.cidades.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
