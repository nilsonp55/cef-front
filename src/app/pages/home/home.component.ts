import { DOCUMENT } from '@angular/common';
import jwt_decode, { JwtPayload } from "jwt-decode";
import { Component, Inject, OnInit } from '@angular/core';
import { ManejoFechaToken } from '../shared/utils/manejo-fecha-token';

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


  constructor(@Inject(DOCUMENT) document: any) { }

  ngOnInit(): void {
    this.capturaToken();
  }
  
  capturaToken() {
    this.respuestaUrl = window.location.hash;
    console.log("Proceso timepo")
    console.log(this.respuestaUrl)
    if (this.respuestaUrl.length > 0) {
      const _respuesta = this.respuestaUrl.split(/[=,&]/)
      console.log("Proceso timepo")
      console.log(_respuesta)
      this.tokenOficial = _respuesta[3]
      var decodificado = jwt_decode(this.tokenOficial);
      this.serializarToken(decodificado, this.tokenOficial)
    }
  }

  serializarToken(decodificado: any, tokenOficial: any) {debugger
    var _userName = decodificado.name
    this.tokenExpira = decodificado.exp
    console.log(decodificado)
    sessionStorage.setItem('token', btoa(tokenOficial))
    sessionStorage.setItem('user', btoa(_userName))
    sessionStorage.setItem('time_token_exp', this.tokenExpira)
    ManejoFechaToken.manejoFechaToken()
  }



}
