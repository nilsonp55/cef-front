import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Costos flete charter
 * @BaironPerez
 */
export class CostosFleteCharterService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.COSTOS_FLETE_CHARTER}`;

    constructor(private http: HttpClient) { }

    /** 
     * Servicio para listar los Costos flete charter
    */
    obtenerCostosFleteCharter(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.COSTOS_FLETE_CHARTER_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para gurdar un registros de Costos flete charter
     */
    guardarCostosFleteCharter(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.COSTOS_FLETE_CHARTER_GUARDAR}`, param);
    }

}