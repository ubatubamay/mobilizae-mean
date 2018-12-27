import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AjudasService } from 'src/app/services/ajudas.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuarios';
import { Ajudas } from 'src/app/models/ajudas';
import { Campanhas } from 'src/app/models/campanhas';
import { Materiais } from 'src/app/models/materiais';
import { NotificacaoService } from 'src/app/components/compartilhado/mensagens/notificacao.service';

export interface DialogData {
  campanha: Campanhas;
  material: Materiais;
}

@Component({
  selector: 'app-confirma-ajuda-material',
  templateUrl: './confirma-ajuda-material.component.html',
  styleUrls: ['./confirma-ajuda-material.component.scss']
})
export class ConfirmaAjudaMaterialComponent implements OnInit {

  usuario: Usuario;
  public formConfirmaAjudaMaterial: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmaAjudaMaterialComponent>,
    private _ajudas: AjudasService,
    private _auth: AuthService,
    private _notif: NotificacaoService) { }

  ngOnInit() {
    this.usuario = this._auth.getCurrentUser();
    this.formConfirmaAjudaMaterial = this.fb.group({
      qtd: ['1', [Validators.required]]
    });
  }

  onCloseConfirm() {
    this.dialogRef.close('Confirm');
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  createAjuda(model: any, isValid: boolean, e: any) {
    if (isValid){
      const ajuda: Ajudas = {
        campanha: this.data.campanha._id,
        tipo: this.data.campanha.tipo,
        qtd: model.qtd,
        contribuicao: this.data.material.nome,
        usuario: this.usuario.userId
      };
  
      this._ajudas.postAjuda(ajuda)
      .subscribe(
        res => {
          this.onCloseCancel();
          this._notif.notifica('Ajuda registrada!');    
        },
        err => {
          this.onCloseCancel();
          this._notif.notifica('Erro ao registrar ajuda');
        }
      );
    }    
  }

}
