
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
        return this.http.get<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_CONSULTA}`, { params: params, headers });
    }

    /**
       * Servicio para ejecutar proceso archivos pendiente carga
      */
    procesarArchivos(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_PROCESAR}`, param, {headers});
    }

    /**
       * Servicio para ver los errores resultado del procesamiento
      */
    verErroresArchivos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_PROCESAR}`, param);
    }

    obtenerArchivoDetalleProcesar(params: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_DETALLE_PROCESAR}`, { params: params, headers });
    }

    obtenerArchivoDetalleErrorProcesar(params: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_DETALLE_ERROR_PROCESAR}`, { params: params, headers });
    }

    eliminarArchivo(param: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_ELIMINAR}`, param, {headers});
    }

    obtenerConciliadasTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_CONCILIADAS}`, { params: params, headers });
    }

    descargarArchivoError(params: any) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get(`${this.url}${URLs.CARGUE_FILE + URLs.ARCHIVOS_PENDIENTE_CARGA_DESCARGAR}`, { params: params, observe: 'response', responseType: 'blob', headers });
    }

    obtenerConciliadasNoIdentificadas(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_COBRADAS_NO_IDENTIFICADAS}`, { params: params, headers });
    }

    desconciliarConciliadasTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_DESCONCILIAR}`, params, { headers });
    }

    aceptarRechazarCobradasTDVNoIdentificadasTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ACEPTAR_RECHAZAR}`, params, { headers });
    }

    obtenerLiquidadasNoCobradas(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_LIQUIDADAS_NO_COBRADAS}`, { params: params, headers });
    }

    obtenerIdentificadasConDiferenciaTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_IDENTIFICADAS_CON_DIFERENCIAS}`, { params: params, headers });
    }

    obtenerIdentificadasConDiferencia(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_LIQUIDADAS_NO_COBRADAS}`, { params: params, headers });
    }

    eliminarRechazarLiquidadasNoCobradasTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ELIMINAR_RECHAZAR_LQUIDADAS_NO_COBRADAS}`, params, { headers });
    }

    obtenerRegistrosEliminadosTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_REGISTROS_ELIMINADOS}`, { params: params, headers});
    }

    aceptadoRechazadoIdentificadasConDifTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ACEPTADO_RECHAZADO_IDENTIFICADAS_CON_DIFERENCIA}`, params, { headers });
    }

    reintegrarRegistrosEliminadosTransporte(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ELIMINADAS_REINTEGRAR}`, params, { headers });
    }
    /*Procesamiento */
    obtenerConciliadasProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_CONCILIADAS}`, { params: params, headers });
    }

    desconciliarConciliadasProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_DESCONCILIAR}`, params, { headers });
    }

    obtenerCobradasTDVNoIdentificadasProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_COBRADAS_NO_IDENTIFICADAS}`, { params: params, headers });
    }

    aceptarRechazarCobradasTDVNoIdentificadasProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_COBRADAS_NO_IDENTIFICADAS_ACEPTAR_RECHAZAR}`, params, { headers });
    }

    obtenerLiquidadasNoCobradasTDVProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_LIQUIDADAS_NO_COBRADAS}`, { params: params, headers });
    }

    eliminarRechazarLiquidadasNoCobradasTDVProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_LIQUIDADAS_NO_COBRADAS_ELIMINAR_RECHAZAR}`, params, { headers });
    }

    obtenerIdentificadasConDiferenciasProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_IDENTIFICADAS_CON_DIFERENCIAS}`, { params: params, headers });
    }

    aceptarRechazarIdentificadasConDiferenciasProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_IDENTIFICADAS_CON_DIFERENCIAS_ACEPTAR_RECHAZAR}`, params, { headers });
    }

    obtenerRegistrosEliminadosProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_ELIMINADAS}`, { params: params, headers });
    }

    reintegrarRegistrosEliminadosProcesamiento(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_ELIMINADAS_REINTEGRAR}`, params, { headers });
    }

    /** Gestion archivos - Servicio para listar archivos liquidacion*/
    obtenerRegistrosGestionArchivos(params: any) {
      const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
      return this.http.get<any>(`${this.url}${URLs.GESTION_ARCHIVOS_CONSULTAR}`, { params: params, headers });
    }

    /** Gestion archivos - Servicio para descargar archivos */
    descargarGestionArchivos(param: any): Observable<any> {
      const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
      return this.http.post<any>(`${this.url}${URLs.GESTION_ARCHIVOS_DESCARGAR}`,  param, {headers});
    }

    /** Cerrar archivos - Servicio para descargar archivos */
    cerrarGestionArchivos(param: any): Observable<any> {
      const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
      return this.http.post<any>(`${this.url}${URLs.GESTION_ARCHIVOS_CERRAR}`,  param, {headers});
    }
}
