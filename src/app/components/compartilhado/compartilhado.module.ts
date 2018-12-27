import { NgModule, ModuleWithProviders } from '@angular/core';
import { SnackbarComponent } from './mensagens/snackbar/snackbar.component';
import { NotificacaoService } from './mensagens/notificacao.service';

@NgModule ({
    declarations: [SnackbarComponent],
    imports: [],
    exports: [SnackbarComponent]
})

export class CompartilhadoModulo {
    static footRoot(): ModuleWithProviders {
        return {
            ngModule: CompartilhadoModulo,
            providers: [NotificacaoService]
        }
    }
}