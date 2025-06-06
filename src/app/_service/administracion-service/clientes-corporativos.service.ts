import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from '../http-base.service'; // Adjusted path
import { URLs } from 'src/app/pages/shared/constantes';
import { HttpClient } from '@angular/common/http'; // Keep HttpClient for constructor super call

@Injectable({
  providedIn: 'root'
})

/**
 * Clase service para servicios de clientes corporativos
 * @author prv_nparra
 */
export class ClientesCorporativosService extends HttpBaseService { // Extend HttpBaseService

  constructor(http: HttpClient) { // Keep HttpClient for super call
    super(http); // Call super constructor
  }

  /**
   * @author prv_nparra
   */
  listarClientesCorporativos(param?: any): Observable<any> {
    return this.get<any>(`${URLs.CLIENTE}/`, param); // Use inherited get method
  }

  /**
   * @author prv_nparra
   */
  obtenerClienteCorporativo(codigoCliente: number): Observable<any> {
    return this.get<any>(`${URLs.CLIENTE}/${codigoCliente}`); // Use inherited get method
  }

  /**
   * @author prv_nparra
   */
  guardarClientesCorporativos(param: any): Observable<any> {
    return this.post<any>(`${URLs.CLIENTE}/`, param); // Use inherited post method
  }

  /**
   * @author prv_nparra
   */
  actualizarClientesCorporativos(params: any): Observable<any> {
    return this.put<any>(`${URLs.CLIENTE}/`, params); // Use inherited put method
  }

  /**
   * @author prv_nparra
   */
  eliminarClientesCorporativos(codigoCliente: number): Observable<any> {
    return this.delete<any>(`${URLs.CLIENTE}/${codigoCliente}`); // Use inherited delete method
  }
}
