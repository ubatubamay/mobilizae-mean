import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AjudasService } from 'src/app/services/ajudas.service';
import { AuthService } from 'src/app/services/auth.service';
import { Ajudas } from 'src/app/models/ajudas';
import { Usuario } from 'src/app/models/usuarios';
import { Campanhas } from 'src/app/models/campanhas';
import { Vagas } from 'src/app/models/vagas';
import { NotificacaoService } from 'src/app/components/compartilhado/mensagens/notificacao.service';

export interface DialogData {
  campanha: Campanhas;
  vaga: Vagas;
}

@Component({
  selector: 'app-confirma-ajuda-vaga',
  templateUrl: './confirma-ajuda-vaga.component.html',
  styleUrls: ['./confirma-ajuda-vaga.component.scss']
})
export class ConfirmaAjudaVagaComponent implements OnInit {

  usuario: Usuario;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialogRef: MatDialogRef<ConfirmaAjudaVagaComponent>,
              private _ajudas: AjudasService,
              private _auth: AuthService,
              private _notif: NotificacaoService) { }

  ngOnInit() {
    this.usuario = this._auth.getCurrentUser();
  }

  onCloseConfirm() {
    this.dialogRef.close('Confirm');
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  createAjuda() {
    const ajuda: Ajudas = {
      campanha: this.data.campanha._id,
      tipo: this.data.campanha.tipo,
      qtd: 1,
      contribuicao: this.data.vaga.nome,
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
