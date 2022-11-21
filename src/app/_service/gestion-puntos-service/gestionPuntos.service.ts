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
export class GestionPuntosService {

    private url: string = `${environment.HOST}${URLs.STAGE}${URLs.GESTION_PUNTOS}`;

    constructor(private http: HttpClient) { }

    /** 
    * Servicio para listar los puntos
    */
    listarPuntosCreados(params: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.CONSULTAR_PUNTOS}`, { params: params });
    }

    /** 
    * Servicio para listar los puntos
    */
     consultarPuntoCreadoById(idPunto: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.CONSULTAR_PUNTOS}/${idPunto}`);
    }

    /** 
    * Servicio para listar los puntos
    */
     crearPunto(param: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.post<any>(`${this.url}${URLs.GUARDAR_PUNTO}`, { param });
    }

}