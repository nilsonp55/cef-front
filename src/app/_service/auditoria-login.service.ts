import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de Auditoria
 * @BaironPerez
 */
export class AuditoriaService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_AUDITORIA}`;

    constructor(private readonly http: HttpClient) { }

    /**
     * Servicio para gurdar una escala
     */
    guardarAuditoria(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.ADMIN_AUDITORIA_GUARDAR}`, param);
    }

}