import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cargue-definitivo',
  templateUrl: './cargue-definitivo.component.html'
})
export class CargueDefinitivoComponent implements OnInit {

  //Stepper
  isLinear = false;
  tipoCargue= "DEFIN"
  idTabSeleccionda:number = 0;

  constructor() { }

  ngOnInit(): void {
  }
  changeTab(event: number){
    this.idTabSeleccionda = event;
  }
}
