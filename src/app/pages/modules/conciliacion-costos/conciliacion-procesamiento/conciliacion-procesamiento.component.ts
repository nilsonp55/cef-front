import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-conciliacion-procesamiento',
  templateUrl: './conciliacion-procesamiento.component.html',
  styleUrls: ['./conciliacion-procesamiento.component.css']
})
export class ConciliacionProcesamientoComponent implements OnInit {

  @Output() filtro: any;
  idTabSeleccionda:number = 0;

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
