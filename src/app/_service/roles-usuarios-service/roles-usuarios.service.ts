import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { URLs } from '../../pages/shared/constantes';

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para consumir los servicios de roles y menus
 * @BaironPerez
 */
export class RolMenuService {

    private readonly urlMenuRol: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_MENU_ROL}`;
    private readonly urlUsuario: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_USUARIO}`;
    private readonly urlRol: string = `${environment.HOST}${URLs.STAGE + URLs.ADMIN_ROL}`;

    constructor(private readonly http: HttpClient) { }


    /** 
     * Servicio para crear rol
    */
    guardarRol(params: any): Observable<any> {
        return this.http.post<any>(`${this.urlRol}${URLs.ADMIN_ROL_GUARDAR}`, params);
    }

    /** 
     * Servicio para actualizar rol
    */
    actualizarRol(rol: any, previousId: string): Observable<any> {
        const params = {previousId: previousId}

        return this.http.put<any>(`${this.urlRol}${URLs.ADMIN_ROL_ACTUALIZAR}`, rol, {params: params});
    }

    /** 
     * Servicio para listar menu rol
    */
    obtenerMenuRol(params: any): Observable<any> {
        return this.http.get<any>(`${this.urlMenuRol}${URLs.ADMIN_MENU_ROL_CONSULTAR}`, { params: params });
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
        return this.http.get<any>(`${this.urlUsuario}${URLs.ADMIN_USUARIO_CONSULTAR}`, { params: params });
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