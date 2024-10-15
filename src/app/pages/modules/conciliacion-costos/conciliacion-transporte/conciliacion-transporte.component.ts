import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-conciliacion-transporte',
  templateUrl: './conciliacion-transporte.component.html',
  styleUrls: ['./conciliacion-transporte.component.css']
})
export class ConciliacionTransporteComponent implements OnInit {

  @Output() filtro: any;
  idTabSeleccionda:number = 0;
  @Output() Pantalla: any = 1;

  constructor() { }

  ngOnInit(): void {
  }

  filter(event) {
    this.filtro = event
  }

  cambioTab(event: number){
    this.idTabSeleccionda = event;
  }

}
