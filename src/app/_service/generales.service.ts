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

    //private url: string = `${environment.HOST}${URLs.URI}`;
    private url: string = `${environment.HOST}${URLs.STAGE}`;

    constructor(private http: HttpClient) { }

    /** 
    * Servicio para listar las transpordadoras
    */
    listarTransportadoras(): Observable<any> {
        const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.get(`${this.url}${URLs.TRANSPORTADORA}${URLs.TRANSPORTADORA_CONSULTA}`,{headers});
    }


    /** 
    * Servicio para listar los bancos del grupo aval
    * @JuanMazo
    */
    listarBancosAval(): Observable<any> {
        const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.get(`${this.url}${URLs.BANCOS}${URLs.BANCO_CONSULTA}?esAVAL=true`,{headers});

    }

    /**
    * Servicio para listar todos los bancos
    * @JuanMazo
    */
    listarBancos(): Observable<any> {
        const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.get(`${this.url}${URLs.BANCOS}${URLs.BANCO_CONSULTA}`,{headers});
    }

    /** 
    * Servicio para listar las ciudades
    * @BayronPerez
    */
      listarCiudades(): Observable<any> {
        const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.get(`${this.url}${URLs.CIUDADES}${URLs.CIUDADES_CONSULTA}`,{headers});
    }

    /** 
    * Servicio para listar los bancos del grupo aval
    * @BayronPerez
    */
     listarDominioByDominio(dominio: any): Observable<any> {
        //const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.get<any>(`${this.url}${URLs.DOMINIO}${URLs.DOMINIO_CONSULTA}`,{params:dominio},);
    }

    /** 
    * Servicio para obtener parametros por filtro
    * @BayronPerez
    */
     listarParametroByFiltro(param: any): Observable<any> {
        //const headers = { 'Authorization': 'Bearer '+sessionStorage.getItem('token')}
        return this.http.get(`${this.url}${URLs.PARAMETRO}${URLs.PARAMETRO_CONSULTA}`, { params: param });
    }

    listarDominioXDominio(dominio: any): Observable<any> {
        return this.http.get<any>(`${this.url}${URLs.DOMINIO}${URLs.DOMINIO_CONSULTA_X_DOMINIO}`,{params:dominio},);
    }

}