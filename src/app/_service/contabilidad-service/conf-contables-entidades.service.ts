import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Cuentas puc
 * @BaironPerez
 */
export class ConfContablesEntidadesService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_CONF_CONTABLE_ENTIDADES}`;

    constructor(private readonly http: HttpClient) { }

    /** 
     * Servicio para listar las cuentas puc
    */
    obtenerConfContablesEntidades(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.ADMIN_CONF_CONTABLE_ENTIDADES_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para gurdar una cuenta puc
     */
     guardarConfContablesEntidades(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CONF_CONTABLE_ENTIDADES_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una cuenta puc
     */
     actualizarConfContablesEntidades(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_CONF_CONTABLE_ENTIDADES_ACTUALIZAR}`, param);
    }
}