import { DOCUMENT } from '@angular/common';
import jwt_decode, { JwtPayload }  from "jwt-decode";
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  respuestaUrl: string;
  tokenOficial: any;
  constructor(@Inject(DOCUMENT) document: any) { }
      
  ngOnInit(): void {
    this.capturaToken();
  }

  capturaToken() {
    console.log(window.location)
    this.respuestaUrl = window.location.hash;
    console.log("Valor del Hash: "+this.respuestaUrl)
    if(this.respuestaUrl.length>0) {
      const _respuesta = this.respuestaUrl.split(/[=,&]/)
      this.tokenOficial = _respuesta[3]
      var decodificado = jwt_decode(this.tokenOficial);
      this.serializarToken(decodificado,this.tokenOficial)
    }

  }

  serializarToken(decodificado: any, tokenOficial: any){
    var _userName = decodificado.name
      sessionStorage.setItem('token', tokenOficial)
      sessionStorage.setItem('user', _userName)
  }

}
