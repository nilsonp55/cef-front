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
export class OpConciliadasService {

    private url: string = `${environment.HOST}${URLs.STAGE}${URLs.CONCILIACION}`;
    private urlReabrir: string = `${environment.HOST}${URLs.STAGE + URLs.OPERACIONES_PROGRAMADAS}`;

    //private url: string = `${environment.HOST}${URLs.API_VERSION}${URLs.CONCILIACION}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de archivos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();

    /** 
     * Servicio para listar conciliados
    */
    obtenerConciliados(params: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_CONSULTA}`, { params: params });
    }

    /**
     * Servicio para listar las operaciones progrmadas sin conciliar
     * @returns 
     */
    obtenerOpProgramadasSinconciliar(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.OP_PROGRAMADAS_SIN_CONCILIAR}`, { params: params, headers });
    }

    /**
     * Servicio para listar las operaciones certificadas sin conciliar
     * @param param 
     * @returns 
     */
    obtenerOpCertificadasSinconciliar(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.OP_CERTIFICADAS_SIN_CONCILIAR}`, { params: params, headers });
    }

    /**
     * Servicio que perminte hacer una conciliacion manual entregando los id de cada operacion
     * @param idOperacion 
     * @param idCertificacion 
     * @JuanMazo
     */
    conciliacionManual(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.CONCILIACION_MANUAL}`, param );
    }

    /**
     * Servicio que nos trae la lista de OP Programadas fallidas
     * @JuanMazo
     */
    listarOpProgrmadasFallidas(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.OP_PROGRAMADAS_SIN_CONCILIAR + '?estadoConciliacion=FALLIDA&estadoConciliacion=CANCELADA&estadoConciliacion=POSPUESTA&estadoConciliacion=FUERA_DE_CONCILIACION'}`, { params: params, headers });
    }

    /**
     * Servicio que nos trae la lista de OP Certificadas fallidas
     * @JuanMazo
     */
    listarOpCertificadasFallidas(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url + '/certificadas-no-conciliadas-estadoconciliacion-no_conciliada-estadoconciliacion-fallida-estadoconciliacion-cancelada-estadoconciliacion-pospuesta-estadoconciliacion-fuera_de_conciliacion'}`, { params: params });
    }

    /**
     * Servicio que nos permite descociliar una operación
     * @param idConciliacion Recibe un parametro con el cual se hace la desociliación
     */
    desconciliar(idConciliacion: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}/${URLs.DESCONCILIAR}`, [idConciliacion])
    }

    /** 
    *Metodo encargado de optener el resumen de operaciones
    *@BaironPerez
    */
    obtenerResumen(data: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.OP_RESUMEN}`, data);
    }

    /**
     * Servicio que permite actualizar el estado de las operaciones programadas
     * @JuanMazo
     */
    actualizarOpProgramadas(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post(`${this.url}${URLs.ACTUALIZAR_OP_PROGRAMADAS}`, params);
    }

    /**
     * Servicio que permite actualizar el estado de las operaciones certificadas
     * @JuanMazo
     */
    actualizarOpCertificadas(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post(`${this.url}${URLs.ACTUALIZAR_OP_CERTIFICADAS}`, params);
    }

    /**
     * Servicio para cerrar el proceso de conciliación
     */
    public procesar(): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.CONCILIACION_CIERRE}`, null);
    }

    /** 
 * Metodo para eliminar un registro de archivo previamente cargado
*/
    reabrirArchivo(param: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.urlReabrir}${URLs.OPERACIONES_PROGRAMADAS_REABRIR}`, { params: param, headers });
    }

    public updateEstadoProgramadas(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.UPDATE_ESTADO_PROGRAMADAS}`, param, {headers});
    }

    public updateEstadoCertificadas(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.UPDATE_ESTADO_CERTIFICADAS}`, param, {headers});
    }
}