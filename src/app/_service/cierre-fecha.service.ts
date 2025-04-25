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
export class CierreFechaService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.CIERRE_FECHA}`;

    constructor(private readonly http: HttpClient) { }

    /**
     * Servicio para cerrar el ciclo de periodo del dia
     * @returns 
     */
    realizarCierreFecha(): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.CIERRE_FECHA_CIERRE}`, null );
    }
    
}