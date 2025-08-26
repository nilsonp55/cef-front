import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { URLs } from 'src/app/pages/shared/constantes';
import { HttpBaseService } from '../http-base.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios para la gestion de los puntos
 * @BaironPerez
 */
export class GestionPuntosService extends HttpBaseService{

    constructor(http: HttpClient) { 
        super(http);
    }

    /** 
    * Servicio para listar los puntos
    */
    listarPuntosCreados(params?: any): Observable<any> {
        return this.get<any>(`${URLs.GESTION_PUNTOS}${URLs.CONSULTAR_PUNTOS}`, params);
    }

    /** 
    * Servicio para listar los puntos
    */
    consultarPuntoCreadoById(idPunto: any): Observable<any> {
        return this.get<any>(`${URLs.GESTION_PUNTOS}${URLs.CONSULTAR_PUNTOS}/${idPunto}` );
    }

    /** 
    * Servicio para listar los puntos
    */
    crearPunto(param: any): Observable<any> {
        return this.post<any>(`${URLs.GESTION_PUNTOS}${URLs.GUARDAR_PUNTO}`, param);
    }

    actualizarPunto(param: any): Observable<any> {
        return this.put<any>(`${URLs.GESTION_PUNTOS}${URLs.ACTUALIZAR_PUNTO}`, param );
    }

    /**
    * Servicio para listar los puntos tdv
    */
    listarPuntosCreadosTDV(params: any): Observable<any> {
        return this.get<any>(`${URLs.GESTION_PUNTOS}${URLs.CONSULTAR_PUNTOS}`, params);
    }
}