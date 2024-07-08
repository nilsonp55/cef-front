import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { URLs } from 'src/app/pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios para la gestion de los puntos
 * @BaironPerez
 */
export class GestionPuntosService {

    private url: string = `${environment.HOST}${URLs.STAGE}${URLs.GESTION_PUNTOS}`;
    private urlTDV: string = `${environment.HOST}${URLs.STAGE}${URLs.GESTION_PUNTOS_TDV}`;

    constructor(private http: HttpClient) { }

    /**
    * Servicio para listar los puntos
    */
    listarPuntosCreados(params: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.CONSULTAR_PUNTOS}`, { params: params });
    }

    /**
    * Servicio para listar los puntos
    */
     consultarPuntoCreadoById(idPunto: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.get<any>(`${this.url}${URLs.CONSULTAR_PUNTOS}/${idPunto}`);
    }

    /**
    * Servicio para listar los puntos
    */
     crearPunto(param: any): Observable<any> {
        const formData: FormData = new FormData();
        return this.http.post<any>(`${this.url}${URLs.GUARDAR_PUNTO}`, { param });
    }

    /**
    * Servicio para listar los puntos tdv
    */
    listarPuntosCreadosTDV(params: any): Observable<any> {
      const formData: FormData = new FormData();
      return this.http.get<any>(`${this.urlTDV}${URLs.CONSULTAR_PUNTOS}`, { params: params });
  }
}
