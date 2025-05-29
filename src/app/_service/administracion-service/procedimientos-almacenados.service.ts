import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from 'src/app/pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Procedimientos Almacenados
 * @BaironPerez
 */
export class ProcedimientosAlmacenadosService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.FUNCIONES_DINAMICAS}`;

    constructor(private readonly http: HttpClient) { }

    /** 
     * Servicio para listar los procedimientos
    */
    obtenerProcedimientos(params?: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.FUNCIONES_DINAMICAS_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para gurdar una Procedimientos
     */
     guardarProcedimientos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.FUNCIONES_DINAMICAS_EJECUTAR}`, param);
    }

    /**
     * Servicio para guardar una Procedimientos
     */
     actualizarProcedimientos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.FUNCIONES_DINAMICAS_ACTUALIZAR}`, param);
    }

}