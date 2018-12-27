import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificacaoService } from '../notificacao.service';
import { Observable, timer } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  animations: [
    trigger('snackbar-visibility', [
      state('hidden', style({
        opacity: 0,
        bottom: '0px'
      })),
      state('visible', style({
        opacity: 1,
        bottom: '30px'
      })),
      transition('hidden => visible', animate('500ms 0s ease-in')),
      transition('visible => hidden', animate('500ms 0s ease-out')),      
    ])
  ]
})
export class SnackbarComponent implements OnInit {

  mensagem: string = 'Hello there!';

  snackVisibility: string = 'hidden';

  constructor(private notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.notificacaoService.notificacao
      .pipe(
        tap(mensagem => {
          this.mensagem = mensagem
          this. snackVisibility = 'visible'
        }), 
        switchMap(mensagem => timer(3000))
    ).subscribe(timer => this.snackVisibility = 'hidden')
  }

}
