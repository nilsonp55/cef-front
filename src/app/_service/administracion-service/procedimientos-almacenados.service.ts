import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from 'src/app/pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Procedimientos Almacenados
 * @BaironPerez
 */
export class ProcedimientosAlmacenadosService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.FUNCIONES_DINAMICAS}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


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
     * Servicio para gurdar una Procedimientos
     */
     actualizarProcedimientos(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.FUNCIONES_DINAMICAS_ACTUALIZAR}`, null);
    }

}