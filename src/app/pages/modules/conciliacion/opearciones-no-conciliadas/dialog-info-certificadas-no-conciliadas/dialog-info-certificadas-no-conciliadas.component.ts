import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import * as moment from 'moment';

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
  displayedColumnsInfoOpCertificadas: string[] = ['idCertificacion','codigoFondoTDV','codigoBanco', 'codigoCiudad', 'codigoPuntoOrigen', 'codigoPuntoDestino', 'tipoPuntoOrigen','tipoPuntoDestino','fechaEjecucion', 'tipoOperacion', 'tipoServicio', 'estadoConciliacion', 'conciliable', 'valorTotal', 'valorFaltante', 'valorSobrante', 'fallidaOficina'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConciliacionesCertificadaNoConciliadasModel) { 
    data.fechaEjecucion = moment(data.fechaEjecucion).format('DD/MM/YYYY')
    this.dataSourceInfoOpCertificadas = new MatTableDataSource([data]);
  }

  ngOnInit(): void {
  }

}
