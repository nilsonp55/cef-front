import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cargue-programacion',
  templateUrl: './cargue-programacion.component.html',
  styleUrls: ['./cargue-programacion.component.css']
})
export class CargueProgramacionComponent implements OnInit {

  checkMenuLateral: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * @JuanMazo
   * Metodo que permite ver el estado del menu lateral
   * @param $event
   */
  onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }
  }

}
