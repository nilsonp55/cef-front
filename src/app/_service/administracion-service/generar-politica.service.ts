import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from 'src/app/pages/shared/constantes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerarPoliticaService {

  private readonly url: string = `${environment.HOST}${URLs.STAGE}`;

  constructor(private readonly http: HttpClient) { }

  generarPolitica(): Observable<any>{
      return this.http.get<any>(`${this.url}${URLs.GENERAR_POLITICA}`);
  }
}
