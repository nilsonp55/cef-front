
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

    private readonly url: string = `${environment.HOST}${URLs.STAGE}`;

    constructor(private readonly http: HttpClient) { }

    /**
     * Variable reactiva para optener la lista de archivos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();

    /**
     * Servicio para listar archivos pendiente carga
    */
    obtenerListaArchivoPendienteCarga(params: any) {
        return this.http.get<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_CONSULTA}`, { params: params });
    }

    /**
       * Servicio para ejecutar proceso archivos pendiente carga
      */
    procesarArchivos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_PROCESAR}`, param);
    }

    /**
       * Servicio para ver los errores resultado del procesamiento
      */
    verErroresArchivos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_PROCESAR}`, param);
    }

    obtenerArchivoDetalleProcesar(params: any) {
        return this.http.get<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_DETALLE_PROCESAR}`, { params: params});
    }

    obtenerArchivoDetalleErrorProcesar(params: any) {
        return this.http.get<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_DETALLE_ERROR_PROCESAR}`, { params: params});
    }

    eliminarArchivo(param: any) {
        return this.http.post<any>(`${this.url}${URLs.ARCHIVOS_PENDIENTE_CARGA_ELIMINAR}`, param);
    }

    obtenerConciliadasTransporte(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_CONCILIADAS}`, { params: params });
    }

    descargarArchivoError(params: any) {
        return this.http.get(`${this.url}${URLs.CARGUE_FILE + URLs.ARCHIVOS_PENDIENTE_CARGA_DESCARGAR}`, { params: params, observe: 'response', responseType: 'blob' });
    }

    obtenerConciliadasNoIdentificadas(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_COBRADAS_NO_IDENTIFICADAS}`, { params: params});
    }

    desconciliarConciliadasTransporte(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_DESCONCILIAR}`, params );
    }

    aceptarRechazarCobradasTDVNoIdentificadasTransporte(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ACEPTAR_RECHAZAR}`, params );
    }

    obtenerLiquidadasNoCobradas(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_LIQUIDADAS_NO_COBRADAS}`, { params: params });
    }

    obtenerIdentificadasConDiferenciaTransporte(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_IDENTIFICADAS_CON_DIFERENCIAS}`, { params: params });
    }

    obtenerIdentificadasConDiferencia(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_LIQUIDADAS_NO_COBRADAS}`, { params: params });
    }

    eliminarRechazarLiquidadasNoCobradasTransporte(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ELIMINAR_RECHAZAR_LQUIDADAS_NO_COBRADAS}`, params);
    }

    obtenerRegistrosEliminadosTransporte(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_CONSULTAR_REGISTROS_ELIMINADOS}`, { params: params });
    }

    aceptadoRechazadoIdentificadasConDifTransporte(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ACEPTADO_RECHAZADO_IDENTIFICADAS_CON_DIFERENCIA}`, params );
    }

    reintegrarRegistrosEliminadosTransporte(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_TRANSPORTE_ELIMINADAS_REINTEGRAR}`, params );
    }
    /*Procesamiento */
    obtenerConciliadasProcesamiento(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_CONCILIADAS}`, { params: params });
    }

    desconciliarConciliadasProcesamiento(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_DESCONCILIAR}`, params );
    }

    obtenerCobradasTDVNoIdentificadasProcesamiento(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_COBRADAS_NO_IDENTIFICADAS}`, { params: params });
    }

    aceptarRechazarCobradasTDVNoIdentificadasProcesamiento(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_COBRADAS_NO_IDENTIFICADAS_ACEPTAR_RECHAZAR}`, params );
    }

    obtenerLiquidadasNoCobradasTDVProcesamiento(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_LIQUIDADAS_NO_COBRADAS}`, { params: params });
    }

    eliminarRechazarLiquidadasNoCobradasTDVProcesamiento(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_LIQUIDADAS_NO_COBRADAS_ELIMINAR_RECHAZAR}`, params, );
    }

    obtenerIdentificadasConDiferenciasProcesamiento(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_IDENTIFICADAS_CON_DIFERENCIAS}`, { params: params });
    }

    aceptarRechazarIdentificadasConDiferenciasProcesamiento(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_IDENTIFICADAS_CON_DIFERENCIAS_ACEPTAR_RECHAZAR}`, params );
    }

    obtenerRegistrosEliminadosProcesamiento(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_CONSULTAR_ELIMINADAS}`, { params: params });
    }

    reintegrarRegistrosEliminadosProcesamiento(params: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.CONCILIACION_PROCESAMIENTO_ELIMINADAS_REINTEGRAR}`, params );
    }

    /** Gestion archivos - Servicio para listar archivos liquidacion*/
    obtenerRegistrosGestionArchivos(params: any) {
      return this.http.get<any>(`${this.url}${URLs.GESTION_ARCHIVOS_CONSULTAR}`, { params: params });
    }

    /** Gestion archivos - Servicio para descargar archivos */
    descargarGestionArchivos(param: any): Observable<any> {
      return this.http.post<any>(`${this.url}${URLs.GESTION_ARCHIVOS_DESCARGAR}`,  param );
    }

    /** Cerrar archivos - Servicio para descargar archivos */
    cerrarGestionArchivos(param: any): Observable<any> {
      return this.http.post<any>(`${this.url}${URLs.GESTION_ARCHIVOS_CERRAR}`,  param );
    }
}
