import { Injectable } from "@angular/core";
import { HttpBaseService } from "../http-base.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { URLs } from "src/app/pages/shared/constantes";

@Injectable({
    providedIn: 'root'
})

/**
 * Clase service para servicios de dominios funcionales
 * @author prv_nparra
 */
export class DominioFuncionalService extends HttpBaseService {

    constructor(http: HttpClient) {
        super(http);
    }

    listarTiposPuntos(params?: any): Observable<any> {
        return this.get<any>(`${URLs.DOMINIO}${URLs.CONSULTAR_DOMINIO}`, params);
    }

    guardarDominioFuncional(param: any): Observable<any> {
        return this.post<any>(`${URLs.DOMINIO}${URLs.DOMINIO_CREAR}`, param);
    }

    actualizarDominioFuncional(param: any): Observable<any> {
        return this.put<any>(`${URLs.DOMINIO}${URLs.DOMINIO_ACTUALIZAR}`, param);  
    }
}