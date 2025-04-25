import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from 'src/app/pages/shared/constantes';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DominioMaestroService {
  private readonly url: string = `${environment.HOST}${URLs.STAGE}${URLs.DOMINIOS}`;

  constructor(private readonly http: HttpClient) {}

  listarDominiosTrue(params: any) {
    return this.http.get<any>(`${this.url}${URLs.DOMINIO_OBTENER}`, { params: params });
  }

  listarDominios() {
    return this.http.get<any>(`${this.url}${URLs.DOMINIOS_TODOS}`);
  }

  crearDominio(param: any): Observable<any> {
    return this.http.post<any>(`${this.url}${URLs.DOMINIO_CREAR}`, param );
  }

  actualizarDominio(param: any): Observable<any> {
    return this.http.put(`${this.url}${URLs.DOMINIO_ACTUALIZAR}`, param);
  }

  eliminarDominio(idDominio: string): Observable<any> {
    return this.http.delete(`$${this.url}${URLs.DOMINIO_ELIMINAR}/${idDominio}` );
  }
}
