import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Centro ciudades
 * @BaironPerez
 */
export class CentroCiudadesService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_CENTRO_CIUDAD}`;//

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


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
        const formData: FormData = new FormData();
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
}