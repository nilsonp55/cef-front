import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { URLs } from 'src/app/pages/shared/constantes';

@Injectable({
  providedIn: 'root'
})

/**
 * Clase service para servicios de clientes corporativos
 * @author prv_nparra
 */
export class ClientesCorporativosService {

  private url: string = `${environment.HOST}${URLs.STAGE}`;

  constructor(private http: HttpClient) { }

  /**
   * @author prv_nparra
   */
  listarClientesCorporativos(param?: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
    return this.http.get<any>(`${this.url}${URLs.CLIENTE}/`, { params: param, headers });
  }

  /**
   * @author prv_nparra
   */
  obtenerClienteCorporativo(codigoCliente: number): Observable<any> {
    const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
    return this.http.get<any>(`${this.url}${URLs.CLIENTE}/${codigoCliente}`, { headers });
  }

  /**
   * @author prv_nparra
   */
  guardarClientesCorporativos(param: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
    return this.http.post<any>(`${this.url}${URLs.CLIENTE}/`, param, {headers});
  }

  /**
   * @author prv_nparra
   */
  async actualizarClientesCorporativos(params: any): Promise<Observable<any>> {
    const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
    return this.http.put<any>(`${this.url}${URLs.CLIENTE}/`, params, {headers} );
  }

  /**
   * @author prv_nparra
   */
  eliminarClientesCorporativos(codigoCliente: number): Observable<any> {
    const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
    return this.http.delete<any>(`${this.url}${URLs.CLIENTE}/${codigoCliente}`, { headers });
  }
}
