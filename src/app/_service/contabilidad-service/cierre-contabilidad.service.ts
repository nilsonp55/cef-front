import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de cierre contabilidades
 * @BaironPerez
 */
 export class CierreContabilidadService {

    private url: string = `${environment.HOST}${URLs.API_VERSION + URLs.ADMIN_CUENTAS_PUC}`;

    constructor(private http: HttpClient) { }

    /** 
     * Servicio para cierre de contabilidad AM o PM
    */
     cierreContabilidad(param): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CUENTAS_PUC_CONSULTAR}`, param);
    }

}