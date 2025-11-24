import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumo de api de Tarifas Especiales de Clientes
 * @HectorMercado
 */
export class TarifasEspecialesService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.TARIFAS_ESPECIALES}`;
    private urlArchivos: string = `${environment.HOST}${URLs.STAGE + URLs.TARIFAS_ESPECIALES_ARCHIVOS}`;

    constructor(private http: HttpClient) { }

    /** 
     * Servicio para listar las cada tarifa especial por punto
    */
    consultarTarifasEspecialesPunto(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.TARIFAS_ESPECIALES_CONSULTAR}`, { params: params, headers });
    }

    consultarTarifasEspeciales(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}${URLs.TARIFAS_ESPECIALES_CONSULTAR_CLIENTE}`, { params: params, headers });
    }

    consultarArchivosTarifasEspeciales(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.urlArchivos}${URLs.TARIFAS_ESPECIALES_CONSULTAR_ARCHIVOS}`, { params: params, headers });
    }

    consultarDetalleArchivoTarifasEspeciales(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) };
        return this.http.post<any>(
            `${this.urlArchivos}${URLs.TARIFAS_ESPECIALES_CONSULTAR_DETALLE_ARCHIVO}`,
            params, { headers }
        );
    }

    procesarArchivoTarifasEspeciales(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.urlArchivos}${URLs.TARIFAS_ESPECIALES_PROCESAR_ARCHIVOS}`, params, { headers });
    }

    /**
     * Eliminado logico de tarifas especiales punto.
     * @param param 
     * @returns 
     */

    eliminarTarifaEspeciales(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.delete<any>(`${this.url}${URLs.TARIFAS_ESPECIALES_ELIMINAR}`, { params: params, headers });
    }

    eliminarArchivoTarifasEspeciales(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.request<any>('DELETE', `${this.urlArchivos}${URLs.TARIFAS_ESPECIALES_ELIMINAR_ARCHIVOS}`, {
            body: params,
            headers
        })
    }


    /**
     * Servicio para guardar Tarifas especiales
    */
    guardarTarifaEspecialesPunto(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.post<any>(`${this.url}${URLs.TARIFAS_ESPECIALES_GUARDAR}`, param, { headers });
    }

    editarTarifaEspecialesPunto(param: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.put<any>(`${this.url}${URLs.TARIFAS_ESPECIALES_ACTUALIZAR}`, param, { headers });
    }


    consultarUnidaCobro(param) {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.url}/unidad-cobro?tipoComision=${param}`, { headers });
    }

}