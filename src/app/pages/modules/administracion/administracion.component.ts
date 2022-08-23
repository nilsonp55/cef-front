import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})

/**
 * Clase que contiene todas las pestañas de administración
 * @BayronPerez
 */
export class AdministracionComponent implements OnInit {

  checkMenuLateral: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Metodo encargado de obtener el valor del check del Baner-Superior 
   * para cerrar o abrir  la barra lateral izquierda
   * @BayronPerez
   */
   onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }

  }

}
