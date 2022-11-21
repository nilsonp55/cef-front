import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Escalas
 * @BaironPerez
 */
export class EscalasService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_ESCALAS}`;

    constructor(private http: HttpClient) { }


    /** 
     * Servicio para listar las escalas
    */
    obtenerEscalas(params?: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_ESCALAS_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para gurdar una escala
     */
    guardarEscala(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_ESCALAS_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una escala
     */
    actualizarEscala(param: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.ADMIN_ESCALAS_ACTUALIZAR}`, param);
    }
}