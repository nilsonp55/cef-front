import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Puntos codigo
 * @BaironPerez
 */
export class PuntosCodigoService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.PUNTOS_CODIGO}`;

    constructor(private http: HttpClient) { }


    /**
     * Servicio para listar los puntos codigo TDV
    */
    obtenerPuntosCodigoTDV(params?: any): Observable<any> {
		const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.get<any>(`${this.url}${URLs.PUNTOS_CODIGO_CONSULTAR}`, { params: params, headers });
    }

    /**
     * Servicio para gurdar un punto codigo TDV
     */
    guardarPuntosCodigoTDV(params: any): Observable<any> {
		const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.post<any>(`${this.url}${URLs.PUNTOS_CODIGO_GUARDAR}`, { params: params, headers });
    }

    /**
     * Servicio para gurdar una Punto Codigo TDV
     */
    actualizarPuntosCodigoTDV(params: any): Observable<any> {
		const headers = { 'Authorization': 'Bearer '+ atob(sessionStorage.getItem('token'))}
        return this.http.put<any>(`${this.url}${URLs.PUNTOS_CODIGO_ACTUALIZAR}`, { params: params, headers });
    }
}
