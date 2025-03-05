import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Costos flete charter
 * @BaironPerez
 */
export class ErroresCostosService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.ERRORES_COSTOS}`;

    constructor(private http: HttpClient) { }

    /**
     * Servicio para gurdar un registros de Costos flete charter
     */
    erroresCostos(param:any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ERRORES_COSTOS_CONSULTAR}`, {params:param});
    }

}