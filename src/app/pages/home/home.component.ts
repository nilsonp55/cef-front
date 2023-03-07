import { DOCUMENT } from '@angular/common';
import jwt_decode, { JwtPayload } from "jwt-decode";
import { Component, Inject, OnInit } from '@angular/core';
import { ManejoFechaToken } from '../shared/utils/manejo-fecha-token';
import { AuditoriaService } from 'src/app/_service/auditoria-login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  respuestaUrl: string;
  tokenOficial: any;
  tokenExpira: any;
  prueba : any;


  constructor(
    @Inject(DOCUMENT) document: any,
    private auditoriaService: AuditoriaService
    ) { }

  ngOnInit(): void {
    this.capturaToken();
  }
  
  capturaToken() {
    this.respuestaUrl = window.location.hash;
    console.log("Proceso timepo")
    console.log(this.respuestaUrl)
    if (this.respuestaUrl.length > 0) {
      const _respuesta = this.respuestaUrl.split(/[=,&]/)
      this.tokenOficial = _respuesta[3]
      var decodificado = jwt_decode(this.tokenOficial);
      this.serializarToken(decodificado, this.tokenOficial)
    }else {
      ManejoFechaToken.manejoFechaToken()
    }
  }

  serializarToken(decodificado: any, tokenOficial: any) {debugger
    var _userName = decodificado.name
    this.tokenExpira = decodificado.exp

    const auditoriaLoginDTO = {
      usuario: sessionStorage.getItem('user'),
      fechaIngreso: new Date()
    }
    this.auditoriaService.guardarAuditoria(auditoriaLoginDTO).toPromise();

    console.log(decodificado)
    sessionStorage.setItem('token', btoa(tokenOficial))
    sessionStorage.setItem('user', btoa(_userName))
    sessionStorage.setItem('time_token_exp', this.tokenExpira)
    ManejoFechaToken.manejoFechaToken()

}
