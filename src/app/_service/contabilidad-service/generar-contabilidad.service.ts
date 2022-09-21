import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, Observable, tap } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de generar contabilidades
 * @BaironPerez
 */
 export class GenerarContabilidadService {

    private url: string = `${environment.HOST}${URLs.STAGE + URLs.CONTABILIDAD}`;

    constructor(private http: HttpClient) { }

    /** 
     * Servicio para general contabilidad AM o PM
    */
    generarContabilidad(param): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.CONTABILIDAD_GENERAL}`, {params: param});
    }

    /** 
    * Servicio para general contabilidad AM o PM
    */
    generarArchivoContabilidad(params: any) {debugger
        return  this.http.get(`${this.url}${URLs.CONTABILIDAD_GENERAR_ARCHIVO}`, {params: params, responseType: 'blob'})
        .pipe(
            tap(data => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'});
                saveAs(blob, 'cierreContable.xls');
            }),
            map(() => true)
        );
    }

    /*descargarArchivoContabilidad1(params: any): Observable<any> {
        return this.http.get(`${this.urlFile}${URLs.CARGUE_ID_ARCHIVO_DESCARGAR}`, { params: params, responseType: 'blob' })
        .pipe(
            tap(content => {
                const blob = new Blob([content], { type: 'text/plain'});
                saveAs(blob, params.nombreArchivo);
            }),
            map(() => true)
        );
    }*/

}
