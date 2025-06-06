import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { URLs } from '../../pages/shared/constantes';
import { saveAs } from 'file-saver';
import { HttpBaseService } from '../http-base.service'; // Adjusted path
import { HttpClient } from '@angular/common/http'; // Keep HttpClient for constructor super call

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de información y cargue de arhivos 
 * @BaironPerez
 */
export class CargueArchivosService extends HttpBaseService { // Extend HttpBaseService

    private readonly urlFile: string = `${URLs.CARGUE_FILE}`; // Relative URL
    private readonly urlFileLoad: string = `${URLs.ARCHIVO_CARGADO}`; // Relative URL

    constructor(http: HttpClient) { // Keep HttpClient for super call
        super(http); // Call super constructor
    }

    /** 
     * Servicio para listar los archivos cargados para el historial paginados
    */
     obtenerArchivosCargados(params: any): Observable<any> {
        return this.get<any>(`${this.urlFileLoad}${URLs.CONSULTAR_X_AGRUPADOR}`, params); // Use inherited get method
    }

    /** 
     * Servicio para listar los archivos subidos para listar los arhivos pendientes de carga
    */
     obtenerArchivosSubidosPendientesCarga(params: any): Observable<any> {
        return this.get<any>(`${URLs.PROGRAMACION_PRELIMINAR}${URLs.PROGRAMACION_PRELIMINAR_CONSULTAR}`, params); // Use inherited get method
    }

    /** 
     * Servicio para obtener un archivo por su id y descargarlo o visualizarlo
    */
     visializarArchivo1(idArchivo: any) {
        return this.downloadFile(`${this.urlFile}${URLs.CARGUE_ARCHIVO_DESCARGAR}/${idArchivo}`) // Use inherited downloadFile method
            .pipe(
                tap(content => {
                    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    saveAs(blob, 'prueba.xlsx');
                }),
                map(() => true)
            );
    }

    visializarArchivo2(params: any): Observable<any> {
        // Assuming this is a text file download, adjust if necessary
        return this.http.get(`${this.baseUrl}${this.urlFile}${URLs.CARGUE_ARCHIVO_DESCARGAR}`, { params: params, responseType: 'text' })
    }

    /**
     * Metodo que nos permite cosumir servicio que nos permite descargar archivo que se encuentra en el S3
     * @param params 
     * @returns 
     */
    visializarArchivo3(params: any): Observable<any> {
        return this.downloadFile(`${this.urlFile}${URLs.CARGUE_ARCHIVO_DESCARGAR}`, params) // Use inherited downloadFile method
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
        return this.downloadFile(`${this.urlFile}${URLs.CARGUE_ID_ARCHIVO_DESCARGAR}`, params) // Use inherited downloadFile method
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
        
        return this.post<any>(`${this.urlFile}${URLs.CARGUE_ARCHIVO_GUARDAR}`, formData); // Use inherited post method
        
    }

}