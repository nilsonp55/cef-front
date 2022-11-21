import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog-info-op-programadas',
  templateUrl: './dialog-info-op-programadas.component.html',
  styleUrls: ['./dialog-info-op-programadas.component.css']
})
export class DialogInfoOpProgramadasComponent implements OnInit {

  valor: number;
  estado: string;
  dataSourceInfoOpProgramadasFallidas: MatTableDataSource<any>;
  displayedColumnsInfoOpProgramadas: string[] = ['idOperacion', 'codigoFondoTDV', 'entradaSalida', 'nombreFondoTDV', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'codigoPuntoDestino', 'fechaProgramacion', 'fechaOrigen', 'fechaDestino', 'tipoOperacion', 'tipoTransporte', 'valorTotal', 'estadoOperacion', 'idNegociacion', 'tasaNegociacion', 'estadoConciliacion', 'idOperacionRelac', 'tipoServicio'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConciliacionesInfoProgramadasNoConciliadasModel
    ) {
    //data.fechaProgramacion = moment(data.fechaProgramacion).format('DD/MM/YYYY')
    //data.fechaOrigen = moment(data.fechaOrigen).format('DD/MM/YYYY')
    //data.fechaCreacion = moment(data.fechaCreacion).format('DD/MM/YYYY')
    //data.fechaDestino =  moment(data.fechaDestino).format('DD/MM/YYYY')
    //data.fechaModificacion =  moment(data.fechaModificacion).format('DD/MM/YYYY')
    this.dataSourceInfoOpProgramadasFallidas = new MatTableDataSource([data]);
  }

  ngOnInit(): void {
    console.log(this.data)
  }

}