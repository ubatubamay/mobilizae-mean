import { EventEmitter } from '@angular/core';

export class NotificacaoService {
    notificacao = new EventEmitter<string>()

    notifica(mensagem: string) {
        this.notificacao.emit(mensagem)
    }
}