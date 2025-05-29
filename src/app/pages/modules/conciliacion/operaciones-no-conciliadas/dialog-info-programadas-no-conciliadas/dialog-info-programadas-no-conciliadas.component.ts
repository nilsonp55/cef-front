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
    this.dataSourceInfoOpProgramadas = new MatTableDataSource([data]);
  }

  ngOnInit(): void {

  }

  displayedColumnsInfoOpProgramadas: string[] = ['nombreFondoTDV', 'entradaSalida', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'fechaProgramacion','fechaOrigen','fechaDestino', 'tipoOperacion', 'valorTotal' ];

}
