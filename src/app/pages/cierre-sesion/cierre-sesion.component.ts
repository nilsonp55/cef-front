import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cierre-sesion',
  templateUrl: './cierre-sesion.component.html',
  styleUrls: ['./cierre-sesion.component.css']
})
export class CierreSesionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    window.location.href = '/index.html'
  }

}
