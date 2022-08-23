import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de generar contabilidades
 * @BaironPerez
 */
 export class ContabilidadService {

    private url: string = `${environment.HOST}${URLs.API_VERSION + URLs.ADMIN_CUENTAS_PUC}`;

    constructor(private http: HttpClient) { }

    /** 
     * Servicio para general contabilidad PM
    */
    generarContabilidadPM(fechaSistema: any, tipoContabilidad: any, numeroBancos: any, codBanco: any, fase: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CUENTAS_PUC_CONSULTAR}/${fechaSistema}/${tipoContabilidad}/${numeroBancos}/${codBanco}/${fase}`,);
    }

    /** 
    * Servicio para general una contabiliad AM
    */
     generarContabilidadAM(fechaSistema: any, tipoContabilidad: any, numeroBancos: any, codBanco: any, fase: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CUENTAS_PUC_CONSULTAR}/${fechaSistema}/${tipoContabilidad}/${numeroBancos}/${codBanco}/${fase}`,);
    }

}