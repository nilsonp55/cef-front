import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cargue-definitivo',
  templateUrl: './cargue-definitivo.component.html',
  styleUrls: ['./cargue-definitivo.component.css']
})
export class CargueDefinitivoComponent implements OnInit {

  //Stepper
  isLinear = false;
  tipoCargue= "DEFIN"

  constructor() { }

  ngOnInit(): void {
  }

}
