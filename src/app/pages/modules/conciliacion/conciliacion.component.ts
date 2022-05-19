import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.css']
})
export class ConciliacionComponent implements OnInit {

  @Input() estadoMenu = true;
  isLinear = false;
  checkMenuLateral: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  /**
   * Metodo encargado de obtener el valor del check del Baner-Superior 
   * para cerrar o abrir  la barra lateral izquierda
   * @BaironPerez
   */
  onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }

  }
  
}
