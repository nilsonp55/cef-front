import { Component, OnInit,Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog-info-programadas-no-conciliadas',
  templateUrl: './dialog-info-programadas-no-conciliadas.component.html',
  styleUrls: ['./dialog-info-programadas-no-conciliadas.component.css']
})
export class DialogInfoProgramadasNoConciliadasComponent implements OnInit {

  dataSourceInfoOpProgramadas: MatTableDataSource<ConciliacionesInfoProgramadasNoConciliadasModel>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConciliacionesInfoProgramadasNoConciliadasModel) { 
    data.fechaProgramacion = moment(data.fechaProgramacion).format('DD/MM/YYYY')
    data.fechaOrigen = moment(data.fechaOrigen).format('DD/MM/YYYY')
    data.fechaCreacion = moment(data.fechaCreacion).format('DD/MM/YYYY')
    data.fechaDestino =  moment(data.fechaDestino).format('DD/MM/YYYY')
    data.fechaModificacion =  moment(data.fechaModificacion).format('DD/MM/YYYY')
    this.dataSourceInfoOpProgramadas = new MatTableDataSource([data]);
  }

  ngOnInit(): void {

  }

  displayedColumnsInfoOpProgramadas: string[] = ['idOperacion','codigoFondoTDV','entradaSalida', 'tipoPuntoOrigen', 'codigoPuntoOrigen', 'tipoPuntoDestino', 'codigoPuntoDestino', 'fechaProgramacion','fechaOrigen','fechaDestino', 'tipoOperacion', 'tipoTransporte', 'valorTotal', 'estadoOperacion', 'idNegociacion', 'tasaNegociacion', 'estadoConciliacion', 'idOperacionRelac', 'tipoServicio' ];

}
