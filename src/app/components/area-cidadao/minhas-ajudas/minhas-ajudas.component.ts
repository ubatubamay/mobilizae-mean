import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { AjudasService } from 'src/app/services/ajudas.service';

@Component({
  selector: 'app-minhas-ajudas',
  templateUrl: './minhas-ajudas.component.html',
  styleUrls: ['./minhas-ajudas.component.scss']
})
export class MinhasAjudasComponent implements OnInit {

  usuario: Usuario;
  ajudas: [];

  displayedColumns: string[] = ['escola', 'campanha', 'contribuicao', 'status'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _auth: AuthService,
              private _ajudas: AjudasService) { }

  ngOnInit() {
    this.usuario = this._auth.getCurrentUser();
    this._ajudas.getAjudasCidadao(this.usuario.userId)
      .subscribe(ajudas => {
        this.ajudas = ajudas;
      }, error => console.log(error));

    this.dataSource = new MatTableDataSource(this.ajudas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
