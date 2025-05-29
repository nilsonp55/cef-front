import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLs } from 'src/app/pages/shared/constantes';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GenerarArchivoService {

  private readonly url: string = `${environment.HOST}${URLs.STAGE + URLs.GENERAR_ARCHIVO}`;

  constructor(private readonly http: HttpClient) { }

  generarArchivo(param): Observable<any> {
    return this.http.get(
      `${this.url}${URLs.GENERAR}`, 
      {params: param, observe: 'response', responseType: 'blob' }
    );
  }
}
