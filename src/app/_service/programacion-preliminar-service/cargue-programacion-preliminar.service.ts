import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de información del cargue preliminar
 * @BaironPerez
 */
export class CargueProgramacionPreliminarService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.PROGRAMACION_PRELIMINAR}`;
    private urlReabrir: string = `${environment.HOST}${URLs.STAGE + URLs.OPERACIONES_PROGRMADAS}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de archivos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();
 
    /** 
     * Metodo para eliminar un registro de archivo previamente cargado
    */
     public deleteArchivo(param: any) {
        const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.delete<any>(`${this.url}${URLs.CARGUE_ARCHIVO_ELIMINAR}`, { params: param,  headers});
    }

    /** 
     * Metodo para eliminar un registro de archivo previamente cargado
    */
     reabrirArchivo(param: any) {
        const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.get<any>(`${this.urlReabrir}${URLs.OPERACIONES_PROGRMADAS_REABRIR}`, { params: param,  headers });
    }
    
    /**
     * Servicio para ralizar la validación de un archivo 
     */
     public validarArchivo(params: any): Observable<any> {
     const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.get<any>(`${this.url}${URLs.PROGRAMACION_PRELIMINAR_VALIDAR}`, { params: params, headers });
    }

    /**
     * Servicio para ralizar el procesamiento de un archivo 
     */
     public procesarArchivo(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.get<any>(`${this.url}${URLs.PROGRAMACION_PRELIMINAR_PROCESAR}`, { params: params, headers });
    }

    /**
     * Servicio para visualizar el detalle de un archivo cargado
     */
     public verDetalleArchivo(param: any): Observable<any> {
     const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.get<any>(`${this.url}${URLs.PROGRAMACION_PRELIMINAR_HISTORICO}`, { params: param, headers});
    }

}