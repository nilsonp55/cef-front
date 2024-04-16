import { DOCUMENT } from '@angular/common';
import jwt_decode, { JwtPayload } from "jwt-decode";
import { Component, Inject, OnInit } from '@angular/core';
import { ManejoFechaToken } from '../shared/utils/manejo-fecha-token';
import { AuditoriaService } from 'src/app/_service/auditoria-login.service';
import { environment } from 'src/environments/environment';

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


  constructor(
    @Inject(DOCUMENT) document: any,
    private auditoriaService: AuditoriaService
  ) { }

  ngOnInit(): void {
    if (environment.usesADD === true) {
      this.capturaToken();
    } else {
      this.capturaTokenSinADD();
    }
  }

  capturaToken() {
    this.respuestaUrl = window.location.hash;
    //console.log("Proceso timepo")
    //console.log(this.respuestaUrl)
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
    var _userName = decodificado.name
    this.tokenExpira = decodificado.exp

    const auditoriaLoginDTO = {
      usuario: _userName,
      fechaIngreso: new Date()
    }
    this.auditoriaService.guardarAuditoria(auditoriaLoginDTO).toPromise();

    //console.log(decodificado)
    sessionStorage.setItem('token', btoa(tokenOficial))
    sessionStorage.setItem('user', btoa(_userName))
    sessionStorage.setItem('time_token_exp', this.tokenExpira)
    ManejoFechaToken.manejoFechaToken()

  }

  capturaTokenSinADD() {
    sessionStorage.setItem('token', btoa(environment.token))
    sessionStorage.setItem('user', btoa(environment.user))
    sessionStorage.setItem('time_token_exp', environment.time_token_exp)
  }

}
