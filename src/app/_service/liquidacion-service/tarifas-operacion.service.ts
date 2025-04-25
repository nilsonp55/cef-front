import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumo de api de Escalas
 * @JuanMazo
 */
export class TarifasOperacionService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.TARIFAS_OPERACION}`;

    constructor(private readonly http: HttpClient) { }

    /** 
     * Servicio para listar las Centro ciudades
    */
    consultarTarifasOperacion(params: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.TARIFAS_OPERACION_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para gurdar una Centro ciudades
     */
     guardarTarifasOperacion(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}${URLs.TARIFAS_OPERACION_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una Centro ciudades
     */
     actualizarTarifasOperacion(param: any): Observable<any> {
        return this.http.put<any>(`${this.url}${URLs.TARIFAS_OPERACION_ACTUALIZAR}`, param);
    }

}