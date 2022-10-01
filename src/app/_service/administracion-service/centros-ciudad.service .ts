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

    private url: string = `${environment.HOST}${URLs.STAGE}${URLs.ADMIN_CENTRO_CIUDAD}`;

    constructor(private http: HttpClient) { }

    /** 
    * Servicio para listar los puntos
    */
    listarCentrosCiudad(): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_CONSULTAR}`, null);
    }

    /** 
    * Servicio para listar los puntos
    */
     consultarCentroCiudadById(idPunto: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_CONSULTAR_ID}`,{params: idPunto});
    }

    /** 
    * Servicio para listar los puntos
    */
     crearCentroCiudad(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CENTRO_CIUDAD_GUARDAR}`, param);
    }

}