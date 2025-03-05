import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Cuentas puc
 * @BaironPerez
 */
export class CuentasPucService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_CUENTAS_PUC}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


    /** 
     * Servicio para listar las cuentas puc
    */
    obtenerCuentasPuc(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CUENTAS_PUC_CONSULTAR}`, { params: params });
    }

    /** 
    * Servicio para obtener una cunta puc
    */
     consultarCuentaPucById(idCuentaPuc: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CUENTAS_PUC_CONSULTAR}/${idCuentaPuc}`);
    }

    /**
     * Servicio para gurdar una cuenta puc
     */
     guardarCuentaPuc(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CUENTAS_PUC_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una cuenta puc
     */
     actualizarCuentaPuc(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CUENTAS_PUC_ACTUALIZAR}`, param);
    }
}