import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de procesos diarios
 * @BaironPerez
 */
export class LogProcesoDiarioService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.PROCESO_DIARIO}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


    /** 
     * Servicio para listar los procesos diarios
    */
    obtenerProcesosDiarios(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.PROCESO_DIARIO_CONSULTAR}`, { params: params });
    }

}