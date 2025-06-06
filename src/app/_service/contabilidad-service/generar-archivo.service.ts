import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from '../http-base.service'; // Adjusted path
import { URLs } from 'src/app/pages/shared/constantes';
import { HttpClient } from '@angular/common/http'; // Keep HttpClient for constructor super call

@Injectable({
  providedIn: 'root'
})

export class GenerarArchivoService extends HttpBaseService { // Extend HttpBaseService

  private readonly url: string = `${URLs.GENERAR_ARCHIVO}`; // Relative URL

  constructor(http: HttpClient) { // Keep HttpClient for super call
    super(http); // Call super constructor
  }

  generarArchivo(param): Observable<any> {
    // Assuming this is a file download, adjust if necessary.
    // The original service used observe: 'response' and responseType: 'blob'.
    // HttpBaseService.downloadFile already handles responseType: 'blob'.
    // If 'observe: response' is critical, HttpBaseService may need adjustment or this method might need to use this.http directly.
    return this.downloadFile(`${this.url}${URLs.GENERAR}`, param);
  }
}
