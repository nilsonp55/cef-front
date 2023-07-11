import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';

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

  operacionCerfida : any[] = [];
  dataSourceInfoOpProgramadas: MatTableDataSource<any>;
  displayedColumnsInfoOpProgramadas: string[] = ['nombreFondoTDV', 'tipoOperacion', 'codigoPuntoOrigen', 'codigoPuntoDestino', 'fecha', 'entradaSalida', 'valorTotal'];

  idsCertifica: any[] = [];
  datosCoparados: any[] = [];
  paramsConciliacionManual: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private opConciliadasService: OpConciliadasService,
    private dialog: MatDialog,) {
      
	this.datosCoparados = [];
	data.origen.forEach(element => {
		if (element.relacion && element.relacion.length > 1 ) {
			this.idsCertifica = [];
			this.idsCertifica = element.relacion.split(',');
			this.idsCertifica.forEach( idCerti  => {
				this.operacionCerfida = null
				this.operacionCerfida = data.destino.filter(operacionProgramada => operacionProgramada.idCertificacion === parseInt(idCerti))
				if (this.operacionCerfida.length > 0) {
					this.datosCoparados.push({
					  tipoOperacion: element.tipoOperacion,
					  valorTotal: element.valorTotal,
					  nombreFondoTDV: element.nombreFondoTDV,
					  tipoPuntoDestino: element.tipoPuntoDestino,
					  nombrePuntoOrigen: element.nombrePuntoOrigen,
					  nombrePuntoDestino: element.nombrePuntoDestino,
					  fechaProgramacion: element.fechaProgramacion,
					  fechaOrigen: element.fechaOrigen ? element.fechaOrigen : "",
					  fechaDestino: element.fechaDestino,
					  entradaSalida: element.entradaSalida,
					  idOperacion: element.idOperacion
					})
					this.datosCoparados.push({
					  tipoOperacion: this.operacionCerfida[0].tipoOperacion,
					  valorTotal: this.operacionCerfida[0].valorTotal,
					  nombreFondoTDV: this.operacionCerfida[0].nombreFondoTDV,
					  nombrePuntoOrigen: this.operacionCerfida[0].nombrePuntoOrigen,
					  fechaEjecucion: this.operacionCerfida[0].fechaEjecucion ? this.operacionCerfida[0].fechaEjecucion : " ",
					  nombrePuntoDestino: this.operacionCerfida[0].nombrePuntoDestino,
					  fechaProgramacion: this.operacionCerfida[0].fechaProgramacion,
					  entradaSalida: this.operacionCerfida[0].entradaSalida,
					  idCertificacion: this.operacionCerfida[0].idCertificacion
					})

          this.paramsConciliacionManual.push({
            idOperacion: element.idOperacion,
            idCertificacion: idCerti
          });
				}
			});
		}
	});
    this.dataSourceInfoOpProgramadas = new MatTableDataSource(this.datosCoparados)
  }

  ngOnInit(): void {
  }

  
  /**
   * Se crea metodo para invocar el servicio y crear la conciliación manual
   * @JuanMazo
   */
  conciliacionManual() {
    
    this.opConciliadasService.conciliacionManual(this.paramsConciliacionManual).subscribe({
      next: (data: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.SUCCESFULL_CONCILIATION,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        
      },
      error: (data: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
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
