import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoricoArchivosCargadosDefinitivoComponent } from './historico-archivos-cargados-definitivo/historico-archivos-cargados-definitivo.component';

@Component({
  selector: 'app-cargue-definitivo',
  templateUrl: './cargue-definitivo.component.html'
})
export class CargueDefinitivoComponent implements OnInit {

  @ViewChild('historico') historico: HistoricoArchivosCargadosDefinitivoComponent;

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

  recargarHistorico(){
    if(this.historico){
      this.historico.listarArchivosCargados();
    }
  }
}
