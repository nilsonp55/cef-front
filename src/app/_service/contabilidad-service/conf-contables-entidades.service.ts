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
export class ConfContablesEntidadesService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_CONF_CONTABLE_ENTIDADES}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


    /** 
     * Servicio para listar las cuentas puc
    */
    obtenerConfContablesEntidades(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CONF_CONTABLE_ENTIDADES_CONSULTAR}`, { params: params });
    }


    /**
     * Servicio para gurdar una cuenta puc
     */
     guardarConfContablesEntidades(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CONF_CONTABLE_ENTIDADES_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una cuenta puc
     */
     actualizarConfContablesEntidades(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CONF_CONTABLE_ENTIDADES_ACTUALIZAR}`, param);
    }
}