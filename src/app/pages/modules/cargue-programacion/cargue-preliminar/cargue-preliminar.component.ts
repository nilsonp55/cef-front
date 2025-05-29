import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cargue-preliminar',
  templateUrl: './cargue-preliminar.component.html'
})

/**
 * Componente para gestionar los cargues de progamación preliminar
 * @BaironPerez
*/
export class CarguePreliminarComponent implements OnInit {

  //Stepper
  isLinear = false;
  tipoCargue= "IPP"

  constructor() { }

  ngOnInit(): void {
  }
}
