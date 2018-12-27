import { Component, OnInit } from '@angular/core';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/dist/js/swiper.esm.js';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay]);

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 4,
      spaceBetween: 50,
      autoplay: {
        delay: 3500,
        disableOnInteraction: true,
      },
      // init: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        }
      }
    });
  }

}
