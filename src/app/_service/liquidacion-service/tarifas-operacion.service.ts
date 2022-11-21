import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumo de api de Escalas
 * @JuanMazo
 */
export class TarifasOperacionService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.TARIFAS_OPERACION}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de procesos actualizados y volver a la pantalla principal
    */
    
    //archivoActualizado: Subject<any[]> = new Subject<any[]>();


    /** 
     * Servicio para listar las Centro ciudades
    */
    consultarTarifasOperacion(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.get<any>(`${this.url}${URLs.TARIFAS_OPERACION_CONSULTAR}`, { params: params, headers });
    }

    /**
     * Servicio para gurdar una Centro ciudades
     */
     guardarTarifasOperacion(param: any): Observable<any> {
        //const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.post<any>(`${this.url}${URLs.TARIFAS_OPERACION_GUARDAR}`, param);
    }

    /**
     * Servicio para gurdar una Centro ciudades
     */
     actualizarTarifasOperacion(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.put<any>(`${this.url}${URLs.TARIFAS_OPERACION_ACTUALIZAR}`, param, {headers});
    }

    /*eliminarTarifasOperacion(param: any):Observable<any> {
        const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.delete<any>(`${this.url}${URLs.TARIFAS_OPERACION_ELIMINAR}`, param, headers);
    }*/
}