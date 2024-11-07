import { Component, OnInit, Inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';

@Component({
  selector: 'app-dialog-conciliacion-manual',
  templateUrl: './dialog-conciliacion-manual.component.html',
  styleUrls: ['./dialog-conciliacion-manual.component.css']
})

/**
 * Comentario
 * @JuanMazo
 * @prv_nparra
 * @rparra
 */
export class DialogConciliacionManualComponent implements OnInit {

  operacionCerfida: any[] = [];
  dataSourceInfoOpProgramadas: MatTableDataSource<any>;
  displayedColumnsInfoOpProgramadas: string[] = ['nombreFondoTDV', 'tipoOperacion', 'codigoPuntoOrigen', 'codigoPuntoDestino', 'fecha', 'entradaSalida', 'valorTotal'];

  idsCertifica: any[] = [];
  datosComparados: any[] = [];
  paramsConciliacionManual: any[] = [];
  totalProg: number = 0;
  totalCertif: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private opConciliadasService: OpConciliadasService,
    private dialog: MatDialog,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {

    let map = new Map<string, string>();

    this.datosComparados = [];
    this.datosComparados.push({
      tipoOperacion: " ",
      valorTotal: " ",
      nombreFondoTDV: "PROGRAMADAS:",
      nombrePuntoOrigen: " ",
      fechaEjecucion: " ",
      nombrePuntoDestino: " ",
      fechaProgramacion: " ",
      entradaSalida: " ",
      idCertificacion: " "
    })
    /* se procesan las operaciones programadas */
    this.data.programadas.forEach(element => {
      this.datosComparados.push({
        tipoOperacion: element.tipoOperacion,
        valorTotal: this.currencyPipe.transform(element.valorTotal, '$', 'symbol', '1.0-0'),
        nombreFondoTDV: element.nombreFondoTDV,
        tipoPuntoDestino: element.tipoPuntoDestino,
        nombrePuntoOrigen: element.nombrePuntoOrigen,
        nombrePuntoDestino: element.nombrePuntoDestino,
        fechaProgramacion: this.datePipe.transform(element.fechaProgramacion,'dd/MM/YYYY', '+00'),
        fechaOrigen: element.fechaOrigen ? this.datePipe.transform(element.fechaOrigen,'dd/MM/YYYY', '+00') : "",
        fechaDestino: this.datePipe.transform(element.fechaDestino,'dd/MM/YYYY', '+00'),
        entradaSalida: element.entradaSalida,
        idOperacion: element.idOperacion
      })
      this.totalProg = this.totalProg + element.valorTotal;
    });

    this.datosComparados.push({
      tipoOperacion: " ",
      valorTotal: " ",
      nombreFondoTDV: "CERTIFICADAS:",
      nombrePuntoOrigen: " ",
      fechaEjecucion: " ",
      nombrePuntoDestino: " ",
      fechaProgramacion: " ",
      entradaSalida: " ",
      idCertificacion: " "
    })
    this.data.certificadas.forEach(element => {

      this.datosComparados.push({
        tipoOperacion: element.tipoOperacion,
        valorTotal: this.currencyPipe.transform(element.valorTotal, '$', 'symbol', '1.0-0'),
        nombreFondoTDV: element.nombreFondoTDV,
        nombrePuntoOrigen: element.nombrePuntoOrigen,
        fechaEjecucion: element.fechaEjecucion ? this.datePipe.transform(element.fechaEjecucion,'dd/MM/YYYY', '+00') : " ",
        nombrePuntoDestino: element.nombrePuntoDestino,
        fechaProgramacion: this.datePipe.transform(element.fechaProgramacion,'dd/MM/YYYY', '+00'),
        entradaSalida: element.entradaSalida,
        idCertificacion: element.idCertificacion
      });
      this.paramsConciliacionManual.push({
        idOperacion: element.relacion,
        idCertificacion: element.idCertificacion
      });
    });

    this.datosComparados.push({
      tipoOperacion: this.currencyPipe.transform(this.totalProg, '$', 'symbol', '1.0-0'),
      valorTotal: " ",
      nombreFondoTDV: "Total Programadas:",
      nombrePuntoOrigen: "Total Certificadas:",
      nombrePuntoDestino: this.currencyPipe.transform(this.totalCertif, '$', 'symbol', '1.0-0'),
      fechaEjecucion: " ",
      fechaProgramacion: " ",
      entradaSalida: "",
      idCertificacion: " "
    });

    this.dataSourceInfoOpProgramadas = new MatTableDataSource(this.datosComparados)
  }


  /**
   * Se crea metodo para invocar el servicio y crear la conciliación manual
   * @JuanMazo
   */
  conciliacionManual() {

    this.opConciliadasService.conciliacionManual(this.paramsConciliacionManual).subscribe({
      next: (data: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.SUCCESFULL_CONCILIATION,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });

      },
      error: (data: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_CONCILIATION + " code: " + data.error.response.code + " description: " + data.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    });
  }

}
