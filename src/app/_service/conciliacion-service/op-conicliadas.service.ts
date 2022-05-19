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

    private url: string = `${environment.HOST}${URLs.API_VERSION + URLs.CONCILIACION}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de archivos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();

    /** 
     * Servicio para listar conciliados
    */
    obtenerConciliados() {
        return this.http.post<any>(`${this.url}${URLs.CONCILIACION_CONSULTA}`, null);
    }

    /**
     * Servicio para listar las operaciones progrmadas sin conciliar
     * @returns 
     */
    obtenerOpProgramadasSinconciliar(): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.OP_PROGRAMADAS_SIN_CONCILIAR + '?estadoConciliacion=No Conciliado'}`, null);
    }

    /**
     * Servicio para listar las operaciones certificadas sin conciliar
     * @param param 
     * @returns 
     */
    obtenerOpCertificadasSinconciliar(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.OP_CERTIFICADAS_SIN_CONCILIAR + '?estadoConciliacion=No Conciliado'}`, null);
    }

    /**
     * Servicio que perminte hacer una conciliacion manual entregando los id de cada operacion
     * @param idOperacion 
     * @param idCertificacion 
     * @JuanMazo
     */
    conciliacionManual(idOperacion: any, idCertificacion: any): Observable<any> {
        return this.http.post<any>(`${environment.HOST}${URLs.API_VERSION}${URLs.CONCILIACION_MANUAL}`, { idOperacion, idCertificacion });
    }

    /**
     * Servicio que nos trae la lista de OP Programadas fallidas
     * @JuanMazo
     */
    listarOpProgrmadasFallidas(): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.OP_PROGRAMADAS_SIN_CONCILIAR + '?estadoConciliacion=No Conciliado&estadoConciliacion=fallido&estadoConciliacion=canceladas&estadoConciliacion=pospuesta&estadoConciliacion=fuera de conciliacion'}`, null);
    }

    /**
     * Servicio que nos trae la lista de OP Certificadas fallidas
     * @JuanMazo
     */
    listarOpCertificadasFallidas(): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.OP_CERTIFICADAS_SIN_CONCILIAR + '?estadoConciliacion=No Conciliado&estadoConciliacion=fallido&estadoConciliacion=canceladas&estadoConciliacion=pospuesta&estadoConciliacion=fuera de conciliacion'}`, null);
    }

    /**
     * Servicio que nos permite descociliar una operación
     * @param idConciliacion Recibe un parametro con el cual se hace la desociliación
     */
    desconciliar(idConciliacion: any) {
        return this.http.post<any>(`${this.url}/${URLs.DESCONCILIAR}`, { idConciliacion })
    }

    /** 
    *Metodo encargado de optener el resumen de operaciones
    *@BaironPerez
    */
    obtenerResumen(): Observable<any> {
        return this.http.get(`${this.url}${URLs.OP_RESUMEN}`);
    }

}