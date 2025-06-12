import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/_service/http-base.service'; 
import { URLs } from 'src/app/pages/shared/constantes';
import { HttpClient } from '@angular/common/http'; // Keep HttpClient for constructor super call

@Injectable({
  providedIn: 'root'
})

/**
 * Clase service para servicios de clientes corporativos
 * @author prv_nparra
 */
export class ClientesCorporativosService extends HttpBaseService{

  constructor(http: HttpClient) { 
    super(http);
  }

  /**
   * @author prv_nparra
   */
  listarClientesCorporativos(param?: any): Observable<any> {
    return this.get<any>(`${URLs.CLIENTE}/`, param);
  }

  /**
   * @author prv_nparra
   */
  obtenerClienteCorporativo(codigoCliente: number): Observable<any> {
    return this.get<any>(`${URLs.CLIENTE}/${codigoCliente}`);
  }

  /**
   * @author prv_nparra
   */
  guardarClientesCorporativos(param: any): Observable<any> {
     return this.post<any>(`${URLs.CLIENTE}/`, param);
  }

  /**
   * @author prv_nparra
   */
  actualizarClientesCorporativos(params: any): Observable<any> {
    return this.put<any>(`${URLs.CLIENTE}/`, params);
  }

  /**
   * @author prv_nparra
   */
  eliminarClientesCorporativos(codigoCliente: number): Observable<any> {
    return this.delete<any>(`${URLs.CLIENTE}/${codigoCliente}`);
  }
}
