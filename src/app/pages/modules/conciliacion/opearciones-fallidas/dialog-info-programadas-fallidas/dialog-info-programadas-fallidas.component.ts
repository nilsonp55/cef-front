import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';

@Component({
  selector: 'app-dialog-info-programadas-fallidas',
  templateUrl: './dialog-info-programadas-fallidas.component.html',
  styleUrls: ['./dialog-info-programadas-fallidas.component.css']
})

/**
 * Clase que permite ampliar la información de la operacion programada a la que se le das click
 * @JuanMazo
 */
export class DialogInfoProgramadasFallidasComponent implements OnInit {

  dataSourceInfoOpProgramadasFallidas: MatTableDataSource<ConciliacionesInfoProgramadasNoConciliadasModel>;
  displayedColumnsInfoOpProgramadas: string[] = ['idOperacion', 'codigoFondoTDV', 'entradaSalida', 'tipoPuntoOrigen', 'codigoPuntoOrigen', 'tipoPuntoDestino', 'codigoPuntoDestino', 'fechaProgramacion', 'fechaOrigen', 'fechaDestino', 'tipoOperacion', 'tipoTransporte', 'valorTotal', 'estadoOperacion', 'idNegociacion', 'tasaNegociacion', 'estadoConciliacion', 'idOperacionRelac', 'tipoServicio'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConciliacionesInfoProgramadasNoConciliadasModel) {
    this.dataSourceInfoOpProgramadasFallidas = new MatTableDataSource([data]);
  }

  ngOnInit(): void {
  }

}
