import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de cierre contabilidades
 * @BaironPerez
 */
 export class CierreContabilidadService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.CONTABILIDAD}`;
    private readonly url2: string =  `${environment.HOST}${URLs.STAGE + URLs.AUTORIZACION_CIERRE_CONTABILIDAD}`;
    
    constructor(private readonly http: HttpClient) { }

    /** 
     * Servicio para cierre de contabilidad AM o PM
    */
     cierreContabilidad(param): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CIERRE_CONTABILIDAD_CERRAR}`, {params: param});
    }

    cierreContabilidadAutorizacion(param): Observable<any> {
        return this.http.get<any>(`${this.url2}${URLs.AUTORIZACION_CONTABILIDAD}`, {params: param});
    } 

}