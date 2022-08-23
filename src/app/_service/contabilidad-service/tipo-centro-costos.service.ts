import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Tipo centro costos
 * @BaironPerez
 */
export class CentroCostosService {

    private url: string = `${environment.HOST}${URLs.API_VERSION + URLs.ADMIN_TIPO_CENTRO_COSTOS}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


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
        const formData: FormData = new FormData();
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
     actualizarCentroCostos(): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_TIPO_CENTRO_COSTOS_ACTUALIZAR}`, null);
    }
}