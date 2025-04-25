import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLs } from "src/app/pages/shared/constantes";
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DesencriptarLlavesService {

    private readonly url: string = `${environment.HOST}${URLs.STAGE}${URLs.LLAVES}`;

    constructor(private http: HttpClient) { }

    generarLlaves(param?: any): Observable<any>{
        return this.http.get<any>(`${this.url}${URLs.LLAVES_GENERAR}`);
    }
}