import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de información del cargue definitivo
 * @BaironPerez
 */
export class CargueProgramacionDefinitivaService {

    private url: string = `${environment.HOST}${URLs.API_VERSION + URLs.PROGRAMACION_DEFINITIVA}`;

    constructor(private http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de archivos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();

    /** 
     * Metodo para eliminar un registro de archivo previamente cargado
    */
    deleteArchivo(param: any) {
        return this.http.delete<any>(`${this.url}${URLs.CARGUE_ARCHIVO_ELIMINAR}`, { params: param });
    }

    /**
     * Servicio para ralizar la validación de un archivo 
     */
     public consultarArchivosCargaDefinitiva(params: any): Observable<any> {debugger
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.PROGRAMACION_DEFINITIVA_CONSULTAR}`, { params: params });
    }

    /**
     * Servicio para ralizar la validación de un archivo 
     */
    public validarArchivo(params: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.PROGRAMACION_DEFINITIVA_VALIDAR}`, { params: params });
    }

    /**
     * Servicio para ralizar el procesamiento de un archivo 
     */
    public procesarArchivo(params: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.PROGRAMACION_DEFINITIVA_PROCESAR}`, { params: params });
    }

    /**
     * Servicio para visualizar el detalle de un archivo cargado
     */
     public verDetalleArchivo(param: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.PROGRAMACION_DEFINITIVA_HISTORICO}`, { params: param });
    }
}