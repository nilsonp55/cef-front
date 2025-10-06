import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from 'src/app/pages/shared/constantes';
import { HttpBaseService } from '../http-base.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultarLogsService extends HttpBaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  consultarLogsAuditoria(params?: any): Observable<any> {
    return this.get<any>(`${URLs.LOGS_AUDITORIA}${URLs.LOGS_AUDITORIA_CONSULTAR}`, params);
  }

  consultarLogsProcesos(params?: any): Observable<any> {
    return this.get<any>(`${URLs.LOGS_AUDITORIA}${URLs.LOGS_AUDITORIA_CONSULTAR_PROCESOS}`, params);
  }

}
