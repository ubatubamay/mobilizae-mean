import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ajudas } from '../models/ajudas';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AjudasService {

  ajudaSelecionada: Ajudas;
  readonly URL_API = 'http://localhost:3000/api/ajudas';

  constructor(private http: HttpClient,
              private _auth: AuthService) {
    this.ajudaSelecionada = new Ajudas();
  }

  getAjudas() {
    return this.http.get<any>(this.URL_API);
  }

  getAjuda(id: string) {
    return this.http.get<any>(this.URL_API + `/${id}`);
  }

  getRequisicoesAjudaEscola(id: string) {
    return this.http.get<any>(this.URL_API + `/filter/requisicao/escola/${id}`);
  }

  getAjudasCidadao(id: string) {
    return this.http.get<any>(this.URL_API + `/filter/cidadao/${id}`);
  }



  postAjuda(ajuda: Ajudas): Observable<string> {
    let headers = new HttpHeaders();
    if (this._auth.isLoggedIn()) {
      headers = headers.set('Authorization', 'Bearer ' + this._auth.usuario.accessToken);
    }
    return this.http.post<Ajudas>(this.URL_API, ajuda, {headers: headers})
        .pipe(
            map(aj => ajuda._id)
        );
  }

  putAjuda(ajuda: Ajudas) {
    return this.http.put(this.URL_API + `/${ajuda._id}`, ajuda);
  }

  deleteAjuda(_id: String) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

  putAjudaStatus(id, novoStatus) {
    return this.http.put(this.URL_API + '/status/'+id, novoStatus);
  }

}
