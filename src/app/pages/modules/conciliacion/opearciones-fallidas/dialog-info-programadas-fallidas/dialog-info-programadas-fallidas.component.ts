import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { ErrorService } from 'src/app/_model/error.model';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { FormControl, FormGroup } from '@angular/forms';

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

  form: FormGroup;
  valor: number;
  estado: string;
  idOpProgramada: number;
  dataElement: any;
  dataSourceInfoOpProgramadasFallidas: MatTableDataSource<ConciliacionesInfoProgramadasNoConciliadasModel>;
  displayedColumnsInfoOpProgramadas: string[] = ['idOperacion', 'codigoFondoTDV', 'entradaSalida', 'nombreFondoTDV', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'codigoPuntoDestino', 'fechaProgramacion', 'fechaOrigen', 'fechaDestino', 'tipoOperacion', 'tipoTransporte', 'valorTotal', 'estadoOperacion', 'idNegociacion', 'tasaNegociacion', 'estadoConciliacion', 'idOperacionRelac', 'tipoServicio'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConciliacionesInfoProgramadasNoConciliadasModel,
    private opConciliadasService: OpConciliadasService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogInfoProgramadasFallidasComponent>
  ) {
    this.idOpProgramada = data.idOperacion;
    this.dataSourceInfoOpProgramadasFallidas = new MatTableDataSource([data]);
  }

  estados: Estado[] = [
    { value: 'cancelada-1', viewValue: 'CANCELADA' },
    { value: 'no_conciliado-2', viewValue: 'NO_CONCILIADA' },
    { value: 'fallida-3', viewValue: 'FALLIDA' },
    { value: 'pospuesta-4', viewValue: 'POSPUESTA' },
    { value: 'fuera_de_conciliacion-4', viewValue: 'FUERA_DE_CONCILIACION' },
  ];

  ngOnInit(): void {
    this.dataElement = this.data;
    this.initForm(this.dataElement);
  }

  /**
   * Función que llama el servicio que actualiza el estado y el valor
   * @JuanMazo
   */
  actualizarEstado() {
    var actualizarRequest: any = {
      idOperacion: this.idOpProgramada
    }
    if (this.valor) {
      actualizarRequest.valor = this.valor
    }
    if (this.estado) {
      actualizarRequest.estado = this.estado
    }

    //Aqui llama al se45rvicio actualizar
    this.opConciliadasService.actualizarOpProgramadas(actualizarRequest).subscribe((page: any) => {
      this.dialogRef.close({ event: "load", data: { "event": "load" } });
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_MODIFICACION,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
   * Metodo de prueba para  actualizar estado
   * @JuanMazo
   */
  condicionActualizacion() {
    var solicitud: any = {
      idOperacion: this.idOpProgramada
    }
    if (this.estado) {
      solicitud.estado = this.estado
      this.opConciliadasService.actualizarOpProgramadas(solicitud).subscribe((page: any) => {
        this.dialogRef.close({ event: "load", data: { "event": "load" } });
      },
        (err: ErrorService) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_MODIFICACION,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          setTimeout(() => { alert.close() }, 3000);
        });
    } else if (this.valor) {
      solicitud.valor = this.valor
      this.opConciliadasService.actualizarOpCertificadas(solicitud).subscribe((page: any) => {
        this.dialogRef.close({ event: "load", data: { "event": "load" } });
      },
        (err: ErrorService) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_MODIFICACION,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          setTimeout(() => { alert.close() }, 3000);
        });
    }
  }

  initForm(param?: any) {
    this.form = new FormGroup({
      'estadoConciliacion': new FormControl(param != null ? this.selectEstados(param.estadoConciliacion) : null),
      'valorTotal': new FormControl(param != null ? param.valorTotal : null),
    });
  }

  selectEstados(param: any): any {
    let response;
    this.estados.forEach(item => {
      if (item.viewValue == param) {
        response = item
      }
    })
    return response;
  }

  persistir() {
    let estadoActualizar = {
      idOperacion: this.idOpProgramada,
      estado: this.form.value['estadoConciliacion'].viewValue,
      valor: this.form.value['valorTotal']
    }
    this.opConciliadasService.actualizarOpProgramadas(estadoActualizar).subscribe((page: any) => {
      this.dialogRef.close({ event: "load", data: { "event": "load" } });
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_MODIFICACION,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
    this.ngOnInit();
  }

  changeState(event) {
    this.estado = event.target.innerText
  }

}

interface Estado {
  value: string;
  viewValue: string;
}
