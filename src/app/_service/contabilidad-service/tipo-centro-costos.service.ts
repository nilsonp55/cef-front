import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Tipo centro costos
 * @BaironPerez
 */
export class CentroCostosService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_TIPO_CENTRO_COSTOS}`;

    constructor(private readonly http: HttpClient) { }

    /** 
     * Servicio para listar los Tipos centro costos
    */
    obtenerCentroCostos(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_TIPO_CENTRO_COSTOS_CONSULTAR}`, { params: params });
    }

    /** 
    * Servicio para obtener un Tipo centro costos
    */
     consultarCentroCostosById(idCuentaPuc: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_TIPO_CENTRO_COSTOS_CONSULTAR}/${idCuentaPuc}`);
    }

    /**
     * Servicio para gurdar un Tipo centro costos
     */
     guardarCentroCostos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_TIPO_CENTRO_COSTOS_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar un Tipo centro costos
     */
     actualizarCentroCostos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_TIPO_CENTRO_COSTOS_ACTUALIZAR}`, param);
    }
}