import { DOCUMENT } from '@angular/common';
import jwt_decode from "jwt-decode";
import { Component, Inject, OnInit } from '@angular/core';
import { ManejoFechaToken } from '../shared/utils/manejo-fecha-token';
import { AuditoriaService } from 'src/app/_service/auditoria-login.service';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  respuestaUrl: string;
  tokenOficial: any;
  tokenExpira: any;
  prueba: any;
  ffConciliacionCostos: boolean = environment.featureFlag.conciliacionCostos;


  constructor(
    @Inject(DOCUMENT) document: any,
    private auditoriaService: AuditoriaService,
    private generalServices: GeneralesService,
  ) { }

  ngOnInit(): void {
    if (environment.usesADD === true) {
      this.capturaToken();
    } else {
      this.capturaTokenSinADD();
    }

    lastValueFrom(this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    })).then((response) => {
      sessionStorage.setItem('fechasistema', btoa(response.data[0].valor));
    });
  }

  capturaToken() {
    this.respuestaUrl = window.location.hash;
    if (this.respuestaUrl.length > 0) {
      const _respuesta = this.respuestaUrl.split(/[=,&]/)
      this.tokenOficial = _respuesta[3]
      var decodificado = jwt_decode(this.tokenOficial);
      this.serializarToken(decodificado, this.tokenOficial)
    } else {
      ManejoFechaToken.manejoFechaToken()
    }
  }

  serializarToken(decodificado: any, tokenOficial: any) {
    let _userName = decodificado.name;
    this.tokenExpira = decodificado.exp;

    const auditoriaLoginDTO = {
      usuario: _userName,
      fechaIngreso: new Date()
    }
    lastValueFrom(this.auditoriaService.guardarAuditoria(auditoriaLoginDTO)).then((response) => {
      console.debug("guardarAuditoria: " + response);
    });

    sessionStorage.setItem('token', btoa(tokenOficial));
    sessionStorage.setItem('user', btoa(_userName));
    sessionStorage.setItem('time_token_exp', this.tokenExpira);
    ManejoFechaToken.manejoFechaToken();

  }

  capturaTokenSinADD() {
    sessionStorage.setItem('token', btoa(environment.token));
    sessionStorage.setItem('user', btoa(environment.user));
    sessionStorage.setItem('time_token_exp', environment.time_token_exp);
  }

}
