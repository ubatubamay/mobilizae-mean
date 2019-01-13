import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCheckboxModule, MatPaginatorModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CompartilhadoModulo } from './components/compartilhado/compartilhado.module';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { CampanhasComponent } from './components/campanhas/campanhas.component';
import { SouUmaEscolaComponent } from './components/sou-uma-escola/sou-uma-escola.component';
import { CadastrarSeComponent } from './components/cadastrar-se/cadastrar-se.component';
import { AreaCidadaoComponent } from './components/area-cidadao/area-cidadao.component';
import { AreaEscolaComponent } from './components/area-escola/area-escola.component';
import { RequisicoesComponent } from './components/area-escola/requisicoes/requisicoes.component';
import { AdicionarCampanhasComponent } from './components/area-escola/adicionar-campanhas/adicionar-campanhas.component';
import { PerfilEscolaComponent } from './components/area-escola/perfil-escola/perfil-escola.component';
import { CampanhaDetalheComponent } from './components/campanhas/campanha-detalhe/campanha-detalhe.component';
import { ConfirmaAjudaVagaComponent } from './components/campanhas/campanha-detalhe/confirma-ajuda-vaga/confirma-ajuda-vaga.component';
import { ConfirmaAjudaMaterialComponent } from './components/campanhas/campanha-detalhe/confirma-ajuda-material/confirma-ajuda-material.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainNavComponent,
    PaginaInicialComponent,
    CampanhasComponent,
    SouUmaEscolaComponent,
    CadastrarSeComponent,
    AreaCidadaoComponent,
    AreaEscolaComponent,
    RequisicoesComponent,
    AdicionarCampanhasComponent,
    PerfilEscolaComponent,
    CampanhaDetalheComponent,
    ConfirmaAjudaVagaComponent,
    ConfirmaAjudaMaterialComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    CompartilhadoModulo.footRoot(),
    RouterModule.forRoot([
      {path: '', component: PaginaInicialComponent},
      {path: 'campanhas', component: CampanhasComponent},
      {path: 'sou-uma-escola', component: SouUmaEscolaComponent},
      {path: 'area-escola', component: AreaEscolaComponent,
        children: [
          {path: '', redirectTo: 'requisicoes', pathMatch: 'full'},
          {path: 'requisicoes', component: RequisicoesComponent},
          {path: 'adicionar-campanha', component: AdicionarCampanhasComponent},
          {path: 'perfil-escola', component: PerfilEscolaComponent},
          
        ]},
      {path: 'area-cidadao', component: AreaCidadaoComponent},
      {path: 'campanha/:id', component: CampanhaDetalheComponent}
    ])
  ],
  entryComponents: [
    CadastrarSeComponent,
    LoginComponent,
    ConfirmaAjudaVagaComponent,
    ConfirmaAjudaMaterialComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
