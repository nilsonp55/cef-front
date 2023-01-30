import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { URLs } from 'src/app/pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios para la gestion de las tasas costos
 * @BaironPerez
 */
export class TasasCostoService {

    private url: string = `${environment.HOST}${URLs.STAGE}${URLs.ADMIN_TASAS_COSTO}`;

    constructor(private http: HttpClient) { }

    /** 
    * Servicio para listar los tasas costos
    */
    listarTasasCosto(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_TASAS_COSTO_CONSULTAR}`, { params: params });
    }

    /** 
    * Servicio para listar los tasas costos
    */
     consultarTasasCostoById(idPunto: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_TASAS_COSTO_CONSULTAR_ID}`,{params: idPunto});
    }

    /** 
    * Servicio para crear los tasas costos
    */
     crearTasasCosto(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_TASAS_COSTO_GUARDAR}`, param);
    }

    /** 
    * Servicio para actualizar los tasas costos
    */
   actualizarTasasCosto(param: any): Observable<any> {
    return this.http.put<any>(`${this.url}${URLs.ADMIN_TASAS_COSTO_ACTUALIZAR}`, param);
}

}