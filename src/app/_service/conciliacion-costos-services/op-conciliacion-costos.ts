
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de archivos conciliados
 * @BaironPerez
 */
export class OpConciliacionCostosService {

    private url: string = `${environment.HOST}${URLs.STAGE}`;
    private urlReabrir: string = `${environment.HOST}${URLs.STAGE + URLs.OPERACIONES_PROGRAMADAS}`;

    //private url: string = `${environment.HOST}${URLs.API_VERSION}${URLs.CONCILIACION}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de archivos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();

    /** 
     * Servicio para listar archivos pendiente carga
    */
    obtenerListaArchivoPendienteCarga(params: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_CONSULTA}`, { params: params });
    }

    procesarArchivos(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_PROCESAR}`, param );
    }

}