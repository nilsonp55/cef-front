import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de procesamiento de las operaciones programadas
 * @BaironPerez
 */
export class OperacionesProgramadasService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.OPERACIONES_PROGRAMADAS}`;

    constructor(private readonly http: HttpClient) { }

    /** 
     * Variable reactiva para optener la lista de archivos actualizados y volver a la pantalla principal
    */
    archivoActualizado: Subject<any[]> = new Subject<any[]>();


   /**
     * Servicio para cerrar el proceso de carga preliminar
     */
    public procesar(param: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.OPERACIONES_PROGRAMADAS_PROCESAR}`,{ params: param });
    }

}