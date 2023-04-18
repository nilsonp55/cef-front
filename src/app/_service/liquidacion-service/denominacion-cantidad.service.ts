import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Denominacion Cantidad
 * @BaironPerez
 */
export class DenominacionCantidadService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.DENOMINACION_CANTIDAD}`;

    constructor(private http: HttpClient) { }


    /** 
     * Servicio para listar las Denominacion cantidad
    */
    obtenerDenominacionCantidad(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.DENOMINACION_CANTIDAD_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para gurdar una Denominacion cantidad
     */
    guardarDenominacionCantidad(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.DENOMINACION_CANTIDAD_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una Denominacion cantidad
     */
    actualizarDenominacionCantidad(param: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.DENOMINACION_CANTIDAD_ACTUALIZAR}`, param);
    }
}