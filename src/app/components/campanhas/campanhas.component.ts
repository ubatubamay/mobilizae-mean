import { Component, OnInit } from '@angular/core';
import { CampanhasService } from 'src/app/services/campanhas.service';
import { Router } from '@angular/router';
import { Campanhas } from 'src/app/models/campanhas';

@Component({
  selector: 'app-campanhas',
  templateUrl: './campanhas.component.html',
  styleUrls: ['./campanhas.component.scss']
})
export class CampanhasComponent implements OnInit {

  campanhas = [];
  constructor(public _campanhas: CampanhasService,
              private router: Router) { }

  ngOnInit() {
    this._campanhas.getCampanhas()
      .subscribe(
        res => this.campanhas = res,
        err => console.log(err)
      );
  }

  getCampanha(campanha: Campanhas) {
    this._campanhas.campanhaSelecionada = campanha;
    this.router.navigate(['/campanha/' + campanha._id ]);
  }

}
