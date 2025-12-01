import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoricoArchivosCargadosComponent } from 'src/app/pages/shared/components/program-preliminar/historico-archivos-cargados/historico-archivos-cargados.component';

@Component({
  selector: 'app-cargue-preliminar',
  templateUrl: './cargue-preliminar.component.html'
})

/**
 * Componente para gestionar los cargues de progamación preliminar
 * @BaironPerez
*/
export class CarguePreliminarComponent implements OnInit {

  @ViewChild('historico') historico: HistoricoArchivosCargadosComponent;

  //Stepper
  isLinear = false;
  idTabSeleccionda:number = 0;
  tipoCargue= "IPP"

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
