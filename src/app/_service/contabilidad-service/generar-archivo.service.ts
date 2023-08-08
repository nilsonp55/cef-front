import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLs } from 'src/app/pages/shared/constantes';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GenerarArchivoService {

  private url: string = `${environment.HOST}${URLs.STAGE + URLs.GENERAR_ARCHIVO}`;

  constructor(private http: HttpClient) { }

  generarArchivo(param): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Authorization', 'Bearer '+ atob(sessionStorage.getItem('token')));
    headers.append('Accept', '*/*');
    return this.http.get(
      `${this.url}${URLs.GENERAR}`, 
      {params: param, observe: 'events', responseType: 'arraybuffer' }
    );
  }
}
