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

  private readonly url: string = `${environment.HOST}${URLs.STAGE}`;

  constructor(private readonly http: HttpClient) { }

  /**
   * @author prv_nparra
   */
  listarClientesCorporativos(param?: any): Observable<any> {
    return this.http.get<any>(`${this.url}${URLs.CLIENTE}/`, { params: param });
  }

  /**
   * @author prv_nparra
   */
  obtenerClienteCorporativo(codigoCliente: number): Observable<any> {
    return this.http.get<any>(`${this.url}${URLs.CLIENTE}/${codigoCliente}`);
  }

  /**
   * @author prv_nparra
   */
  guardarClientesCorporativos(param: any): Observable<any> {
    return this.http.post<any>(`${this.url}${URLs.CLIENTE}/`, param);
  }

  /**
   * @author prv_nparra
   */
  actualizarClientesCorporativos(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}${URLs.CLIENTE}/`, params);
  }

  /**
   * @author prv_nparra
   */
  eliminarClientesCorporativos(codigoCliente: number): Observable<any> {
    return this.http.delete<any>(`${this.url}${URLs.CLIENTE}/${codigoCliente}`);
  }
}
