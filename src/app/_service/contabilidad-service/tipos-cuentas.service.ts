import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de tipos cuentas
 * @BaironPerez
 */
export class TiposCuentasService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_TIPOS_CUENTAS}`;

    constructor(private readonly http: HttpClient) { }

    /**
     * Servicio para listar los tipos cuentas
    */
    obtenerTiposCuentas(params: any): Observable<any> {
      return this.http.get<any>(`${this.url}${URLs.ADMIN_TIPOS_CUENTAS_CONSULTAR}`, { params: params});
    }

    /**
     * Servicio para gurdar un tipo cuenta
     */
     guardarTiposCuentas(param: any): Observable<any> {
      return this.http.post<any>(`${this.url}${URLs.ADMIN_TIPOS_CUENTAS_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar un tipo cuenta
     */
     actualizarTiposCuentas(param: any): Observable<any> {
      return this.http.post<any>(`${this.url}${URLs.ADMIN_TIPOS_CUENTAS_ACTUALIZAR}`, param );
    }


}
