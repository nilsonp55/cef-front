import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { URLs } from '../../pages/shared/constantes';
import { saveAs } from 'file-saver';


@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de información y cargue de arhivos 
 * @BaironPerez
 */
export class CargueArchivosService {

    private readonly urlFiles: string = `${environment.HOST}${URLs.STAGE}`;
    private readonly urlFile: string = `${environment.HOST}${URLs.STAGE + URLs.CARGUE_FILE}`;
    private readonly urlFileLoad: string = `${environment.HOST}${URLs.STAGE + URLs.ARCHIVO_CARGADO}`;

    constructor(private readonly http: HttpClient) { }

    /** 
     * Servicio para listar los archivos cargados para el historial paginados
    */
     obtenerArchivosCargados(params: any): Observable<any> {
        return this.http.get(`${this.urlFileLoad}${URLs.CONSULTAR_X_AGRUPADOR}`, { params: params });
    }

    /** 
     * Servicio para listar los archivos subidos para listar los arhivos pendientes de carga
    */
     obtenerArchivosSubidosPendientesCarga(params: any): Observable<any> {
        return this.http.get(`${this.urlFiles}${URLs.PROGRAMACION_PRELIMINAR}${URLs.PROGRAMACION_PRELIMINAR_CONSULTAR}`, { params: params });
    }

    /** 
     * Servicio para obtener un archivo por su id y descargarlo o visualizarlo
    */
     visializarArchivo1(idArchivo: any) {
        return this.http.get(`${this.urlFile}${URLs.CARGUE_ARCHIVO_DESCARGAR}/${idArchivo}`, { responseType: 'blob' })
            .pipe(
                tap(content => {
                    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    saveAs(blob, 'prueba.xlsx');
                }),
                map(() => true)
            );
    }

    visializarArchivo2(params: any): Observable<any> {
        return this.http.get(`${this.urlFile}${URLs.CARGUE_ARCHIVO_DESCARGAR}`, { params: params, responseType: 'text' })
    }

    /**
     * Metodo que nos permite cosumir servicio que nos permite descargar archivo que se encuentra en el S3
     * @param params 
     * @returns 
     */
    visializarArchivo3(params: any): Observable<any> {
        return this.http.get(`${this.urlFile}${URLs.CARGUE_ARCHIVO_DESCARGAR}`, { params: params, responseType: 'blob' })
        .pipe(
            tap(content => {
                const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                saveAs(blob, params.nombreArchivo);
            }),
            map(() => true)
        );
    }
/**
 * Metodo que llama servicio que nos permite descargar arhcivio desde la base de datos
 * @param params
 * @returns 
 */
    visializarArchivo4(params: any): Observable<any> {
        return this.http.get(`${this.urlFile}${URLs.CARGUE_ID_ARCHIVO_DESCARGAR}`, { params: params, responseType: 'blob' })
        .pipe(
            tap(content => {
                const blob = new Blob([content], { type: 'text/plain'});
                saveAs(blob, params.nombreArchivo);
            }),
            map(() => true)
        );
    }

    /**
     * Servicio para descargar y visualizar un archivo por su id
     */
     public saveFile(files: File[], tipoCargue): Observable<any> {
        const formData: FormData = new FormData();
        for (const file of files) {
            formData.append('file', file, file.name);
            formData.append('tipoCargue', tipoCargue);
        }
        
        return this.http.post<any>(`${this.urlFile}${URLs.CARGUE_ARCHIVO_GUARDAR}`, formData);
        
    }

}