import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { URLs } from 'src/app/pages/shared/constantes';

export class HttpBaseService {
  protected readonly baseUrl: string = `${environment.HOST}${URLs.STAGE}`;

  constructor(protected readonly http: HttpClient) {}

  protected get<T>(url: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, { params });
  }

  protected post<T>(url: string, body: any, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: HttpParams | { [param: string]: string | string[] } }): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, options);
  }

  protected put<T>(url: string, body: any, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: HttpParams | { [param: string]: string | string[] } }): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body, options);
  }

  protected delete<T>(url: string, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: HttpParams | { [param: string]: string | string[] } }): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`, options);
  }

  protected downloadFile(url: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${url}`, { params, responseType: 'blob' });
  }
}