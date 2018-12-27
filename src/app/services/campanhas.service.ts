import { Injectable } from '@angular/core';
import { Campanhas } from '../models/campanhas';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CampanhasService {

  campanhaSelecionada: Campanhas;
  campanhas: Campanhas[];
  readonly URL_API = 'http://localhost:3000/api/campanhas';
  constructor(private http: HttpClient) {
    this.campanhaSelecionada = new Campanhas();
  }

  getCampanhas() {
    return this.http.get<any>(this.URL_API);
  }

  getCampanha(id: string) {
    return this.http.get<any>(this.URL_API + `/${id}`);
  }

  postCampanha(campanha: Campanhas) {
    return this.http.post(this.URL_API, campanha);
  }

  putCampanha(campanha: Campanhas) {
    return this.http.put(this.URL_API + `/${campanha._id}`, campanha);
  }

  deleteCampanha(_id: String) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

}
