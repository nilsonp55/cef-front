import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLs } from "src/app/pages/shared/constantes";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class DominioMaestroService {

    private url: string = `${environment.HOST}${URLs.STAGE}${URLs.DOMINIO_MAESTRO}`;

    constructor(private http: HttpClient) { }

listarDominios() {
    return this.http.get<any>(`${this.url}${URLs.DOMINIO_OBTENER}`);
}
}