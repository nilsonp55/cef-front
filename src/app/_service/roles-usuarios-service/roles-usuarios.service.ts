import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de roles y menus
 * @BaironPerez
 */
export class RolMenuService {

    private urlMenuRol: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_MENU_ROL}`;
    private urlUsuario: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_USUARIO}`;
    private urlRol: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_ROL}`;

    constructor(private http: HttpClient) { }


    /** 
     * Servicio para listar menu rol
    */
    obtenerMenuRol(params: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.urlMenuRol}${URLs.ADMIN_MENU_ROL_CONSULTAR}`, { params: params, headers });
    }

    /**
     * Servicio para gurdar menu rol
     */
    actualizarMenuRol(param: any): Observable<any> {
        return this.http.post<any>(`${this.urlMenuRol}${URLs.ADMIN_MENU_ROL_ACTUALIZAR}`, param);
    }

    /** 
     * Servicio para listar usuario
    */
    obtenerUsuarios(params?: any): Observable<any> {
        const headers = { 'Authorization': 'Bearer ' + atob(sessionStorage.getItem('token')) }
        return this.http.get<any>(`${this.urlUsuario}${URLs.ADMIN_USUARIO_CONSULTAR}`, { params: params, headers });
    }

    /**
     * Servicio para guardar usuario
     */
    guardarUsuario(param: any): Observable<any> {
        return this.http.post<any>(`${this.urlUsuario}${URLs.ADMIN_USUARIO_GUARDAR}`, param);
    }

    /**
     * Servicio para actualizar usuario
     */
    actualizarUsuario(param: any): Observable<any> {
        return this.http.post<any>(`${this.urlUsuario}${URLs.ADMIN_USUARIO_ACTUALIZAR}`, param);
    }

    /** 
     * Servicio para listar usuario
    */
    obtenerRoles(params?: any): Observable<any> {
        return this.http.get<any>(`${this.urlRol}${URLs.ADMIN_ROL_CONSULTAR}`, { params: params });
    }
}