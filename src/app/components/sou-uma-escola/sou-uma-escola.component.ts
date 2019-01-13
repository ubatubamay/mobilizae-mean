import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacaoService } from '../compartilhado/mensagens/notificacao.service';
import { Observable } from 'rxjs';
import { Estados } from 'src/app/models/estados';
import { EstadosService } from 'src/app/services/estados.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-sou-uma-escola',
  templateUrl: './sou-uma-escola.component.html',
  styleUrls: ['./sou-uma-escola.component.scss']
})
export class SouUmaEscolaComponent implements OnInit {

  hide = true;
  isWait: Boolean = false;

  filtroEstados: Observable<Estados[]>;
  estados: Estados[];
  selectedEstado: Estados;

  filtroCidades: Observable<string[]>;
  cidades: string[];

  redes: string[] = ['Municipal', 'Estadual', 'Federal'];
  etapas: string[] = ['Infantil', 'Fundamental', 'Médio', 'Técnico', 'Superior'];

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
              private _notif: NotificacaoService,
              private _estados: EstadosService) { }

  ngOnInit() {

    this.cadastroEscolaForm.get('cidade').disable();

    this._estados.getEstados()
      .subscribe(
        res => this.estados = res,
        err => console.log(err)
      );

    this.filtroEstados = this.cadastroEscolaForm.get('uf').valueChanges
      .pipe(
        startWith<string | Estados>(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(name => name ? this._filter(name) : [])
      );

    this.filtroCidades = this.cadastroEscolaForm.get('cidade').valueChanges
      .pipe(
        startWith<string>(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this._filterCidades(name) : [])
      );

  }

  cadastraUsuario(model: any, isValid: boolean, e: any) {
    model.perfil = 'escola';
    model.uf = model.uf.sigla;
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
    this.cadastroEscolaForm.get('cidade').setValue('');
    this.cadastroEscolaForm.get('cidade').enable();
    this.cidades = this.selectedEstado.cidades;
  }


  // FUNÇÕES CIDADES

  private _filterCidades(name: string): string[]{
    const filterValue = name.toLowerCase();
    return this.cidades.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
