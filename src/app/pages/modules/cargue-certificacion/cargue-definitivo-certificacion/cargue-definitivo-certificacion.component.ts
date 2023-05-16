import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cargue-definitivo-certificacion',
  templateUrl: './cargue-definitivo-certificacion.component.html'
})

/**
 * Esta clase hace alucion a la gestion de los cargues cerificacion (no son definitivos)
 * @BaironPerez
 */
export class CargueDefinitivoCertificacionComponent implements OnInit {

  //Stepper
  isLinear = false;
  tipoCargue= "DEFIN"

  constructor() { }

  ngOnInit(): void {
  }

}
