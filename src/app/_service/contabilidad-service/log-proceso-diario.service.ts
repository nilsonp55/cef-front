import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de procesos diarios
 * @BaironPerez
 */
export class LogProcesoDiarioService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.PROCESO_DIARIO}`;

    constructor(private readonly http: HttpClient) { }

    /** 
     * Servicio para listar los procesos diarios
    */
    obtenerProcesosDiarios(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.PROCESO_DIARIO_CONSULTAR}`, { params: params});
    }

}