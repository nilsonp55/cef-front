import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dialog-conciliacion-manual',
  templateUrl: './dialog-conciliacion-manual.component.html',
  styleUrls: ['./dialog-conciliacion-manual.component.css']
})

/**
 * Comentario
 * @JuanMazo ????????
 */
export class DialogConciliacionManualComponent implements OnInit {

  dataSourceInfoOpProgramadas: MatTableDataSource<any>;
  displayedColumnsInfoOpProgramadas: string[] = ['codigoFondoTDV', 'tipoPuntoOrigen', 'tipoPuntoDestino', 'tipoOperacion', 'codigoPuntoOrigen', 'codigoPuntoDestino', 'fecha', 'tipoServicio', 'valorTotal'];

  datosCoparados: any[] = new Array();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private opConciliadasService: OpConciliadasService,
    private dialog: MatDialog,) {
    var datosCoparados = new Array()
    data.origen.forEach(element => {
      var operacionCerfida = data.destino.filter(operacionProgramada => operacionProgramada.idCertificacion === parseInt(element.relacion))
      if (operacionCerfida.length > 0) {
        datosCoparados.push({
          tipoOperacion: element.tipoOperacion,
          valorTotal: element.valorTotal,
          codigoFondoTDV: element.codigoFondoTDV,
          tipoPuntoOrigen: element.tipoPuntoOrigen,
          tipoPuntoDestino: element.tipoPuntoDestino,
          codigoPuntoOrigen: element.codigoPuntoOrigen,
          codigoPuntoDestino: element.codigoPuntoDestino,
          fechaProgramacion: element.fechaProgramacion,
          fechaOrigen: element.fechaOrigen ? element.fechaOrigen : "",
          fechaDestino: element.fechaDestino,
          tipoServicio: element.tipoServicio,
          idOperacion: element.idOperacion

        })
        datosCoparados.push({
          tipoOperacion: operacionCerfida[0].tipoOperacion,
          valorTotal: operacionCerfida[0].valorTotal,
          codigoFondoTDV: operacionCerfida[0].codigoFondoTDV,
          tipoPuntoOrigen: operacionCerfida[0].tipoPuntoOrigen,
          tipoPuntoDestino: operacionCerfida[0].tipoPuntoDestino,
          codigoPuntoOrigen: operacionCerfida[0].codigoPuntoOrigen,
          fechaEjecucion: operacionCerfida[0].fechaEjecucion ? operacionCerfida[0].fechaEjecucion : " ",
          codigoPuntoDestino: operacionCerfida[0].codigoPuntoDestino,
          fechaProgramacion: operacionCerfida[0].fechaProgramacion,
          tipoServicio: operacionCerfida[0].tipoServicio,
          idCertificacion: operacionCerfida[0].idCertificacion
        })
      }
    });
    this.dataSourceInfoOpProgramadas = new MatTableDataSource(datosCoparados)
  }

  ngOnInit(): void {
  }

  
  /**
   * Se crea metodo para invocar el servicio y crear la conciliación manual
   * @JuanMazo
   */
  conciliacionManual() {
    var idOperacion = this.dataSourceInfoOpProgramadas.data[0].idOperacion
    var idCertificacion = this.dataSourceInfoOpProgramadas.data[1].idCertificacion
    this.opConciliadasService.conciliacionManual(idOperacion, idCertificacion)
      .pipe(
        catchError(error => {
          return of(error);
        })
      )
      .subscribe(item => {
        if (item.status === 400) {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_CONCILIATION,
              codigo: GENERALES.CODE_EMERGENT.WARNING
            }
          });
          setTimeout(() => { alert.close() }, 3000);
        } else {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.SUCCESFULL_CONCILIATION,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          }); setTimeout(() => { alert.close() }, 3000);
        }
      })
  }
}
