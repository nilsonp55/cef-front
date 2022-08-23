import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../pages/shared/constantes';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios genericos para el proyecto
 * @BaironPerez
 */
export class GeneralesService {

    private url: string = `${environment.HOST}${URLs.API_VERSION}`;

    constructor(private http: HttpClient) { }

    /** 
    * Servicio para listar las transpordadoras
    */
    listarTransportadoras(): Observable<any> {
        return this.http.get(`${this.url}${URLs.TRANSPORTADORA}${URLs.TRANSPORTADORA_CONSULTA}`);
    }

    /** 
    * Servicio para listar los bancos del grupo aval
    * @JuanMazo
    */
    listarBancosAval(): Observable<any> {
        return this.http.get(`${this.url}${URLs.BANCOS}${URLs.BANCO_CONSULTA}?esAVAL=true`);
    }

    /**
    * Servicio para listar todos los bancos
    * @BayronPerez
    */
     listarBancos(): Observable<any> {
        return this.http.get(`${this.url}${URLs.BANCOS}${URLs.BANCO_CONSULTA}`);
    }

    /** 
    * Servicio para listar las ciudades
    * @BayronPerez
    */
      listarCiudades(): Observable<any> {
        return this.http.get(`${this.url}${URLs.CIUDADES}${URLs.CIUDADES_CONSULTA}`);
    }

    /** 
    * Servicio para listar los bancos del grupo aval
    * @BayronPerez
    */
     listarDominioByDominio(dominio: any): Observable<any> {
        return this.http.get(`${this.url}${URLs.DOMINIO}${URLs.DOMINIO_CONSULTA}/${dominio}`);
    }

}