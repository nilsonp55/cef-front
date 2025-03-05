import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../pages/shared/constantes';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de archivos conciliados
 * @BaironPerez
 */
export class ValidacionEstadoProcesosService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.VALIDA_ESTADO_PROCESO}`;

    constructor(private http: HttpClient) { }

    /**
     * Servicio para cerrar el ciclo de periodo del dia
     * @returns 
     */
    validarEstadoProceso(param: any): Observable<any> {
        return this.http.get(`${this.url}${URLs.VALIDA_ESTADO_PROCESO_CONSULTAR}`, { params: param });
    }
    
}