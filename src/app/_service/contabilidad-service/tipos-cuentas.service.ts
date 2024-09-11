import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de tipos cuentas
 * @BaironPerez
 */
export class TiposCuentasService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_TIPOS_CUENTAS}`;

    constructor(private http: HttpClient) { }

    /**
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


    /**
     * Servicio para listar los tipos cuentas
    */
    obtenerTiposCuentas(params: any): Observable<any> {
      const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
      return this.http.get<any>(`${this.url}${URLs.ADMIN_TIPOS_CUENTAS_CONSULTAR}`, { params: params, headers });
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
        return this.http.post<any>(`${this.url}${URLs.ADMIN_TIPOS_CUENTAS_ACTUALIZAR}`, param);
    }


}
