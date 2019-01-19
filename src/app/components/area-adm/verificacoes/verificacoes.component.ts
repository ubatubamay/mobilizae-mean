import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacaoService } from '../../compartilhado/mensagens/notificacao.service';

@Component({
  selector: 'app-verificacoes',
  templateUrl: './verificacoes.component.html',
  styleUrls: ['./verificacoes.component.scss']
})
export class VerificacoesComponent implements OnInit {

  escolas: [];
  isWait: boolean = false;

  displayedColumns: string[] = ['escola', 'rede', 'cidade', 'acao'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _usuarios: UsuariosService,
              private _notif: NotificacaoService) { }

  ngOnInit() {
    this._usuarios.getEscolasVerificacao()
      .subscribe(escolas => {
        this.escolas = escolas;
      }, error => console.log(error));

    this.dataSource = new MatTableDataSource(this.escolas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  confirmarVerificacao(idEscola) {
    let verificado = {
      descricao: true
    }
    this.isWait = true;
    this._usuarios.putEscolaVerificacao(idEscola, verificado)
      .subscribe(
        res => {
          this.isWait = false;
          this._notif.notifica('Verificação realizada!');
          this.ngOnInit();
        },
        err => {
          this.isWait = false;
          this._notif.notifica('Erro ao verificar');
        }
      );
  }

  rejeitarVerificacao(idEscola) {
    let verificado = {
      descricao: false
    }
    this.isWait = true;
      this._usuarios.putEscolaVerificacao(idEscola, verificado)
        .subscribe(
          res => {
            this.isWait = false;
            this._notif.notifica('Verificação rejeitada');
            this.ngOnInit();
          },
          err => {
            this.isWait = false;
            this._notif.notifica('Erro ao verificar');
          }
        );
  }

}
