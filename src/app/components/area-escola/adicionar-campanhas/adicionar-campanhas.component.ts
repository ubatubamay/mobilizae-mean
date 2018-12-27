import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { CampanhasService } from 'src/app/services/campanhas.service';
import { Usuario } from 'src/app/models/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacaoService } from '../../compartilhado/mensagens/notificacao.service';

export interface UF {
  value: string;
  viewValue: string;
}

export interface Cidade {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-adicionar-campanhas',
  templateUrl: './adicionar-campanhas.component.html',
  styleUrls: ['./adicionar-campanhas.component.scss']
})
export class AdicionarCampanhasComponent implements OnInit {

  usuario: Usuario = this._auth.getCurrentUser();

  tiposCampanha: string[] = ['Material', 'Voluntariado', 'Material e Voluntariado'];

  novaCampanhaForm = this.fb.group({
    tipo: ['', Validators.required],
    titulo: ['', Validators.required],
    descricao: ['', Validators.required],
    horarios: [''],
    vagas: this.fb.array([
      this.getVaga()
    ]),
    materiais: this.fb.array([
      this.getMaterial()
    ])
  });
  
  constructor(private fb: FormBuilder,
              private _campanhas: CampanhasService,
              private _auth: AuthService,
              private _notif: NotificacaoService) { }

  ngOnInit() {
    this.novaCampanhaForm.get('tipo').valueChanges.subscribe(
      (tipo: string) => {
        if (tipo === 'Voluntariado') {
          this.novaCampanhaForm.get('vagas').setValidators([Validators.required]);
          this.novaCampanhaForm.get('horarios').setValidators([Validators.required]);
          this.novaCampanhaForm.get('materiais').reset();
          this.novaCampanhaForm.get('materiais').setValidators(null);
        } else if (tipo === 'Material') {
          this.novaCampanhaForm.get('materiais').setValidators([Validators.required]);
          this.novaCampanhaForm.get('vagas').reset();
          this.novaCampanhaForm.get('vagas').setValidators(null);
          this.novaCampanhaForm.get('horarios').reset();
          this.novaCampanhaForm.get('horarios').setValidators(null);
        } else if (tipo === 'Material e Voluntariado'){
          this.novaCampanhaForm.get('vagas').setValidators([Validators.required]);
          this.novaCampanhaForm.get('horarios').setValidators([Validators.required]);
          this.novaCampanhaForm.get('materiais').setValidators([Validators.required]);
        } else{
          this.novaCampanhaForm.get('vagas').reset();
          this.novaCampanhaForm.get('materiais').reset();
        }
        this.novaCampanhaForm.get('vagas').updateValueAndValidity();
        this.novaCampanhaForm.get('materiais').updateValueAndValidity();
        this.novaCampanhaForm.get('horarios').updateValueAndValidity();
      }
    );
  }

  // FUNCOES TABELA MATERIAIS
  private getMaterial() {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      nome: ['', []],
      qtd: ['', [Validators.pattern(numberPatern)]]      
    });
  }

  private addMaterial() {
    const control = <FormArray>this.novaCampanhaForm.controls['materiais'];
    control.push(this.getMaterial());
  }

  private removeMaterial(i: number) {
    const control = <FormArray>this.novaCampanhaForm.controls['materiais'];
    control.removeAt(i);
  }



  // FUNCOES TABELA VAGAS
  private getVaga() {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      nome: [''],
      qtd: [1, [Validators.pattern(numberPatern)]]
    });
  }

  private addVaga() {
    const control = <FormArray>this.novaCampanhaForm.controls['vagas'];
    control.push(this.getVaga());
  }

  private removeVaga(i: number) {
    const control = <FormArray>this.novaCampanhaForm.controls['vagas'];
    control.removeAt(i);
  }


  // CRIAR CAMPANHA
  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
    if(isValid){
      model.escola = this.usuario.userId;
      this._campanhas.postCampanha(model)
      .subscribe(
          res => {
            this.novaCampanhaForm.reset();
            this._notif.notifica('Campanha adicionada!');
          },
          err => {
            this._notif.notifica('Erro ao adicionar campanha');
          }
      );
    }  
  }

  

}
