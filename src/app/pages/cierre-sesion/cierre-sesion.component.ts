import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cierre-sesion',
  templateUrl: './cierre-sesion.component.html',
  styleUrls: ['./cierre-sesion.component.css']
})
export class CierreSesionComponent implements OnInit {

  constructor() {
    console.debug("cierre-sesion");
   }

  ngOnInit(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('time_token_exp');
    sessionStorage.removeItem('fechasistema');
  }

  login() {
    window.location.href = '/index.html'
  }

}
