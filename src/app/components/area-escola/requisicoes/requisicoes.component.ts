import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import { Usuario } from 'src/app/models/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { AjudasService } from 'src/app/services/ajudas.service';

@Component({
  selector: 'app-requisicoes',
  templateUrl: './requisicoes.component.html',
  styleUrls: ['./requisicoes.component.scss']
})
export class RequisicoesComponent implements OnInit {

  usuario: Usuario;
  ajudas: [];

  displayedColumns: string[] = ['usuario', 'campanha', 'contribuicao', 'status', 'acao'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private _auth: AuthService,
              private _ajudas: AjudasService) { }

  ngOnInit() {
    this.usuario = this._auth.getCurrentUser();
    this._ajudas.getRequisicoesAjudaEscola(this.usuario.userId)
      .subscribe(ajudas => {
        this.ajudas = ajudas;
      }, error => console.log(error));

    this.dataSource = new MatTableDataSource(this.ajudas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // openDialogPerfil(usuario: Usuario) {
  //   const dialogRef = this.dialog.open(PerfilCidadaoComponent, {
  //     data: {usuario: usuario},
  //     width: '600px'
  //   });
  // }

}
