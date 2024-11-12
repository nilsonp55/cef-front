import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';

@Component({
  selector: 'app-dialog-update-estado-operaciones',
  templateUrl: './dialog-update-estado-operaciones.component.html',
  styleUrls: ['./dialog-update-estado-operaciones.component.css'],
})

/**
 * @prv_nparra
 */
export class DialogUpdateEstadoOperacionesComponent implements OnInit {
  form: FormGroup;

  estadosOperacion: any[] = [
    { value: 'CANCELADA' },
    { value: 'NO_CONCILIADA' },
    { value: 'FALLIDA' },
    { value: 'POSPUESTA' },
    { value: 'FUERA_DE_CONCILIACION' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { listOperaciones: any[]; operacion: string },
    private opConciliadasService: OpConciliadasService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogUpdateEstadoOperacionesComponent>
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      estadoConciliacion: new FormControl(''),
    });
  }

  actualizarOperaciones() {
    const estado = this.form.value['estadoConciliacion'].value;
    let param: any[] = [];
    this.data.listOperaciones.forEach((op) => {
      param.push({
        idOperacion: this.data.operacion === 'C' ? op.idCertificacion : op.idOperacion,
        estado: estado,
      });
    });
    if (this.data.operacion === 'C') {
      this.opConciliadasService.updateEstadoCertificadas(param).subscribe({
        next: (pageConciliadas: any) => {
          let msgDetalle: string = pageConciliadas.data
            .map((conciliadas) => `ID: ${conciliadas.idOperacion} Resultado: ${conciliadas.resultadoFallido ? conciliadas.resultadoFallido : 'OK'}`)
            .join(" - ");
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: pageConciliadas.response.description,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
              showActions: false,
              msgDetalles: msgDetalle,
              showResume: true,
            },
          });
          this.dialogRef.close();
        },
        error: (errConciliadas: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_MODIFICACION + " - " + errConciliadas.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        },
      });
    }
    if (this.data.operacion === 'P') {
      this.opConciliadasService.updateEstadoProgramadas(param).subscribe({
        next: (pageProgramadas: any) => {
          let msgDetalle: string = pageProgramadas.data
            .map((programadas) => `ID: ${programadas.idOperacion} Resultado: ${programadas.resultadoFallido ? programadas.resultadoFallido : 'OK'}`)
            .join(" - ");
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: pageProgramadas.response.description,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
              showActions: false,
              msgDetalles: msgDetalle,
              showResume: true,
            },
          });
          this.dialogRef.close();
        },
        error: (errProgramadas: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_MODIFICACION + " - " + errProgramadas.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        },
      });;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
