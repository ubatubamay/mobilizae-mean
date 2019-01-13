import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area-cidadao',
  templateUrl: './area-cidadao.component.html',
  styleUrls: ['./area-cidadao.component.scss']
})
export class AreaCidadaoComponent implements OnInit {

  links = ['Minhas ajudas', 'Perfil'];
  activeLink = this.links[0];

  constructor() { }

  ngOnInit() {
  }

}
