import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { URLs } from 'src/app/pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios para la gestion de los puntos
 * @BaironPerez
 */
export class CentrosCiudadService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_CENTRO_CIUDAD}`;//

    constructor(private http: HttpClient) { }

    /** 
     * Servicio para listar las Centro ciudades
    */
    obtenerCentrosCiudades(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_CONSULTAR}`, { params: params });
    }

    /** 
    * Servicio para obtener una Centro ciudades
    */
     consultarCentroCiudadById(idCIudad: any, idBanco: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_CONSULTAR}/${idCIudad}/${idBanco}`);
    }

    /**
     * Servicio para gurdar una Centro ciudades
     */
     guardarCentroCiudade(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una Centro ciudades
     */
     actualizarCentroCiudade(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_ACTUALIZAR}`, param);
    }

    /**
     * Servicio para eliminar una Centro ciudades Principal
     */
    eliminarCentroCiudad(param: any): Observable<any> {
        return this.http.delete<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_ELIMINAR}/${param}`);
    }

    /** 
     * Servicio para listar las Centro ciudades Principal
    */
    obtenerCentrosCiudadesPpal(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_PPAL}`, { params: params });
    }

    /**
     * Servicio para gurdar una Centro ciudades Principal
     */
    guardarCentroCiudadePpal(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_PPAL}`, param);
    }

    /**
     * Servicio para gurdar una Centro ciudades Principal
     */
     actualizarCentroCiudadePpal(param: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_PPAL}`, param);
    }

    /**
     * Servicio para eliminar una Centro ciudades Principal
     */
    eliminarCentroCiudadePpal(param: any): Observable<any> {
        return this.http.delete<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_PPAL}/${param}`);
    }

}