import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-area-escola',
  templateUrl: './area-escola.component.html',
  styleUrls: ['./area-escola.component.scss']
})
export class AreaEscolaComponent implements OnInit {

  links = ['Requisições', 'Adicionar campanha', 'Perfil'];
  activeLink = this.links[0];

  constructor() { }

  ngOnInit() {
  }

}
