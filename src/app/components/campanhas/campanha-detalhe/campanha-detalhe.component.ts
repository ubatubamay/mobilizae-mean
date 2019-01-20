import { Component, OnInit, ViewChild } from '@angular/core';
import { Campanhas } from 'src/app/models/campanhas';
import { CampanhasService } from 'src/app/services/campanhas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Vagas } from 'src/app/models/vagas';
import { Materiais } from 'src/app/models/materiais';
import { ConfirmaAjudaVagaComponent } from './confirma-ajuda-vaga/confirma-ajuda-vaga.component';
import { ConfirmaAjudaMaterialComponent } from './confirma-ajuda-material/confirma-ajuda-material.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-campanha-detalhe',
  templateUrl: './campanha-detalhe.component.html',
  styleUrls: ['./campanha-detalhe.component.scss']
})
export class CampanhaDetalheComponent implements OnInit {

  campanha: Campanhas;
  displayedColumns: string[] = ['qtd', 'nome', 'acao'];
  dataSourceMateriais: MatTableDataSource<Materiais>;
  dataSourceVagas: MatTableDataSource<Vagas>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _campanhas: CampanhasService,
              public route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private location: Location) { }

  ngOnInit() {
    this._campanhas.getCampanha(this.route.snapshot.params['id'])
      .subscribe(campanha => {
                this.campanha = campanha;
                
                this.dataSourceMateriais = new MatTableDataSource(this.campanha.materiais);
                this.dataSourceMateriais.paginator = this.paginator;
                this.dataSourceMateriais.sort = this.sort;

                this.dataSourceVagas = new MatTableDataSource(this.campanha.vagas);
                this.dataSourceVagas.paginator = this.paginator;
                this.dataSourceVagas.sort = this.sort;
              });
  }

  openDialogAjudarVaga(campanha: Campanhas, vaga: Vagas) {
    const dialogRef = this.dialog.open(ConfirmaAjudaVagaComponent, {
      data: {campanha: campanha, vaga: vaga},
      width: '600px'
    });
  }

  openDialogAjudarMaterial(campanha: Campanhas, material: Materiais) {
    const dialogRef = this.dialog.open(ConfirmaAjudaMaterialComponent, {
      data: {campanha: campanha, material: material},
      width: '600px'
    });
  }

  voltar() {
    this.location.back();
  }

}
