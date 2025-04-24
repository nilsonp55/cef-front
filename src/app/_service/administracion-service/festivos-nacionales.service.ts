import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
  providedIn: 'root',
})

/**
 * Clase service para consumir los servicios de roles y menus
 * @BaironPerez
 */
export class FestivosNacionalesService {
  private readonly url: string = `${environment.HOST}${
    URLs.STAGE + URLs.ADMIN_FESTIVOS_NACIONALES
  }`;

  constructor(private http: HttpClient) {}

  /**
   * Servicio para listar menu rol
   */
  obtenerFestivosNaciones(): Observable<any> {
    return this.http.get<any>(
      `${this.url}${URLs.ADMIN_FESTIVOS_NACIONALES_CONSULTAR}`
    );
  }

  /**
   * Servicio para gurdar menu rol
   */
  guardarFestivosNacionales(param: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}${URLs.ADMIN_FESTIVOS_NACIONALES_GUARDAR}`,
      param
    );
  }

  /**
   * Servicio para listar usuario
   */
  eliminarFestivosNacionales(param?: any): Observable<any> {
    return this.http.delete<any>(
      `${this.url}${URLs.ADMIN_FESTIVOS_NACIONALES_ELIMINAR}`,
      { params: param }
    );
  }
}
