import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from 'src/app/pages/shared/constantes';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DominioMaestroService {
  private url: string = `${environment.HOST}${URLs.STAGE}${URLs.DOMINIOS}`;

  constructor(private http: HttpClient) {}

  listarDominiosTrue(params: any) {
    const headers = { Authorization: 'Bearer ' + atob(sessionStorage.getItem('token'))};
    return this.http.get<any>(`${this.url}${URLs.DOMINIO_OBTENER}`, { params: params, headers });
  }

  listarDominios() {
    const headers = { Authorization: 'Bearer ' + atob(sessionStorage.getItem('token'))};
    return this.http.get<any>(`${this.url}${URLs.DOMINIOS_TODOS}`, { headers });
  }

  crearDominio(param: any): Observable<any> {
    const headers = { Authorization: 'Bearer ' + atob(sessionStorage.getItem('token'))};
    return this.http.post<any>(`${this.url}${URLs.DOMINIO_CREAR}`, param, { headers } );
  }

  actualizarDominio(param: any): Observable<any> {
    const headers = { Authorization: 'Bearer ' + atob(sessionStorage.getItem('token'))};
    return this.http.put(`${this.url}${URLs.DOMINIO_ACTUALIZAR}`, param, { headers });
  }

  eliminarDominio(idDominio: string): Observable<any> {
    const headers = { Authorization: 'Bearer ' + atob(sessionStorage.getItem('token'))};
    return this.http.delete(`$${this.url}${URLs.DOMINIO_ELIMINAR}/${idDominio}`, { headers } );
  }
}
