import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import jwt_decode, { JwtPayload }  from "jwt-decode";

@Component({
  selector: 'app-init-app',
  templateUrl: './init-app.component.html',
  styleUrls: ['./init-app.component.css']
})
export class InitAppComponent implements OnInit {

  tokenOficial: any;
  respuestaUrl: any;

  constructor(
    @Inject (DOCUMENT) private document: any,
  ) { }

  ngOnInit(): void {
    this.goToUrl();

  }

  goToUrl(): void {
    //PT
    //this.document.location.href = 'https://awue1athcef-pt-admin.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=7lqfnlbaj4afqhq6c6rmbrde1b&redirect_uri=https://cefwebpt.aws.ath.com.co/home&scope=openid';
  
    //QA      
    this.document.location.href = 'https://awue1athcef-qa-admin.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=6gm8bjpvvajuqhi2fiiqegckkv&redirect_uri=https://cefwebqa.aws.ath.com.co/home&scope=openid';
    
    //PRD
    //this.document.location.href = 'https://awue1athcef-prd-admin.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=g9al6c9o6r12f3v1q00jjfhb&redirect_uri=https://cefwebprd.aws.ath.com.co/home&scope=openid';
  
  }

  capturaToken() {
    this.respuestaUrl = window.location.hash;
    const _respuesta = this.respuestaUrl.split(/[=,&]/)
    this.tokenOficial = _respuesta[3]
    var decodificado = jwt_decode(this.tokenOficial);
    this.serializarToken(decodificado,this.tokenOficial)
  }

  serializarToken(decodificado: any, tokenOficial: any){
    var _userName = decodificado.name
    sessionStorage.setItem('token', tokenOficial)
    sessionStorage.setItem('user', _userName)
  }

}
