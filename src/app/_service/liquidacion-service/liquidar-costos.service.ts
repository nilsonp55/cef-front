import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Costos flete charter
 * @BaironPerez
 */
export class LiquidarCostosService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.LIQUIDACION}`;

    constructor(private http: HttpClient) { }

    /**
     * Servicio para gurdar un registros de Costos flete charter
     */
    liquidarCostos(): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.LIQUIDACION_COSTOS}`);
    }

    consultarCostos()  {
        return this.http.get<any>(`${this.url}${URLs.CONSULTAR_COSTOS}`);
    } 

}