import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/dist/js/swiper.esm.js';
import { CampanhasService } from 'src/app/services/campanhas.service';
import { Campanhas } from 'src/app/models/campanhas';
import { Router } from '@angular/router';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay]);

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent implements OnInit, AfterViewInit {

  campanhas = [];

  constructor(public _campanhas: CampanhasService,
              private router: Router) { }

  
  ngAfterViewInit() {
    setTimeout (function(){
      var swiper = new Swiper('.swiper-container', {
        slidesPerView: 4,
        spaceBetween: 50,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        // init: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          490: {
            slidesPerView: 1,
            spaceBetween: 10,
          }
        }
      });
    }, 300);
  }

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
