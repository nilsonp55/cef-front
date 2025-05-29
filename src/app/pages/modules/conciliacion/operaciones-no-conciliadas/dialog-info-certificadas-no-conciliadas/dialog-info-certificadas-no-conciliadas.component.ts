import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';

@Component({
  selector: 'app-dialog-info-certificadas-no-conciliadas',
  templateUrl: './dialog-info-certificadas-no-conciliadas.component.html',
  styleUrls: ['./dialog-info-certificadas-no-conciliadas.component.css']
})

/**
 * Clase pra apliar ifo de las operaiones certificadas
 */
export class DialogInfoCertificadasNoConciliadasComponent implements OnInit {

  dataSourceInfoOpCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>;
  displayedColumnsInfoOpCertificadas: string[] = ['idCertificacion','nombreFondoTDV','nombrePuntoOrigen', 'nombrePuntoDestino', 'codigoPropioTDV', 'fechaEjecucion', 'entradaSalida', 'valorTotal', 'valorFaltante', 'valorSobrante'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConciliacionesCertificadaNoConciliadasModel,
    ) {
    this.dataSourceInfoOpCertificadas = new MatTableDataSource([data]);
  }

  ngOnInit(): void {
  }

}
