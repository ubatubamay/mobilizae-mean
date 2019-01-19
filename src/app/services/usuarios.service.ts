import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  readonly URL_API = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) { }

  cadastraUsuario(usuario) {
    return this.http.post<any>(this.URL_API + '/cadastrar', usuario);
  }

  getUsuario(id) {
    return this.http.get<any>(this.URL_API + '/'+id)
      .pipe(
        tap(usuario => usuario)
      );
  }

  getEscolas() {
    return this.http.get<any>(this.URL_API + '/escolas');
  }

  getEscolasVerificacao() {
    return this.http.get<any>(this.URL_API + '/escolas/verificacao');
  }

  putEscolaVerificacao(id, verificacao) {
    return this.http.put(this.URL_API + '/escola/verificacao/'+id, verificacao);
  }

  updateUsuario(id, atualizacao) {
    return this.http.put<any>(this.URL_API + '/'+id, atualizacao)
      .pipe(
        tap(usuario => usuario)
      );
  }

}