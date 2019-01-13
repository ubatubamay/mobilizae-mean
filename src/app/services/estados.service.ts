import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estados } from '../models/estados';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  estadoSelecionado: Estados;
  readonly URL_API = 'http://localhost:3000/api/estados';

  constructor(private http: HttpClient,) {
    this.estadoSelecionado = new Estados();
  }

  getEstados() {
    return this.http.get<any>(this.URL_API);
  }

  getEstado(id: string) {
    return this.http.get<any>(this.URL_API + `/${id}`);
  }

  searchEstado(nome: string) {
    return this.http.get<any>(this.URL_API + `/busca/${nome}`);
  }

}
