import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de liquidacion mensual
 * @BaironPerez
 */
export class LiquidacionMensualService {

    private urlLiquidacionMensaul: string = `${environment.HOST}${URLs.STAGE + URLs.LIQUIDACION_MENSUAL}`;
    private urlCierreLiquidacionMensual: string = `${environment.HOST}${URLs.STAGE + URLs.LIQUIDACION_MENSUAL}`;

    constructor(private http: HttpClient) { }


    /** 
     * Servicio para listar las escalas
    */
    obtenerLiquidacionMensal(params: any): Observable<any> {
        return this.http.get<any>(`${this.urlLiquidacionMensaul}${URLs.LIQUIDACION_MENSUAL_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para liquidar
     */
    liquidarMensual(param: any): Observable<any> {
        return this.http.post<any>(`${this.urlLiquidacionMensaul}${URLs.LIQUIDACION_MENSUAL_LIQUIDAR}`, param);
    }

    /**
     * Servicio para gurdar la liquidacion
     */
    guardarLiquidacionMensal(param: any): Observable<any> {
        return this.http.post<any>(`${this.urlLiquidacionMensaul}${URLs.LIQUIDACION_MENSUAL_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar la liquidacion
     */
    cerrarLiquidacionMensal(): Observable<any> {
        return this.http.post<any>(`${this.urlCierreLiquidacionMensual}${URLs.LIQUIDACION_MENSUAL_CIERRE}`, null);
    }

}