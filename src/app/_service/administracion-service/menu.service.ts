import { HttpClient } from "@angular/common/http";
import { HttpBaseService } from "../http-base.service";
import { Injectable } from "@angular/core";
import { URLs } from "src/app/pages/shared/constantes";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MenuService extends HttpBaseService {

    constructor(http: HttpClient) { 
        super(http);
    }

    listarMenus(params?: any): Observable<any> {
        return this.http.get<any>(`${URLs.ADMIN_MENU}/`, params);
    }

    createMenu(param?: any): Observable<any> {
        return this.http.post<any>(`${URLs.ADMIN_MENU}/`, param);
    }

    updateMenu(param?: any): Observable<any> {
        return this.http.put<any>(`${URLs.ADMIN_MENU}/`, param);
    }

    deleteMenu(param?: any): Observable<any> {
        return this.http.delete<any>(`${URLs.ADMIN_MENU}/${param}`);
    }

}