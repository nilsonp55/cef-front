import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';
import { HttpBaseService } from '../http-base.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Puntos codigo
 * @BaironPerez
 */
export class PuntosCodigoService extends HttpBaseService {

    constructor(http: HttpClient) { 
        super(http);
    }

    /**
     * Servicio para listar los puntos codigo TDV
    */
    obtenerPuntosCodigoTDV(params?: any): Observable<any> {
        return this.get<any>(`${URLs.PUNTOS_CODIGO}${URLs.PUNTOS_CODIGO_CONSULTAR}`, params);
    }

    /**
     * Servicio para gurdar un punto codigo TDV
     */
    guardarPuntosCodigoTDV(params: any): Observable<any> {
        return this.post<any>(`${URLs.PUNTOS_CODIGO}${URLs.PUNTOS_CODIGO_GUARDAR}`, params);
    }

    /**
     * Servicio para gurdar una Punto Codigo TDV
     */
    actualizarPuntosCodigoTDV(params: any): Observable<any> {
        return this.put<any>(`${URLs.PUNTOS_CODIGO}${URLs.PUNTOS_CODIGO_ACTUALIZAR}`, params);
    }
}
