import {Component, Inject, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/_model/error.model';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-actualizar-op-certificadas',
  templateUrl: './dialog-actualizar-op-certificadas.component.html',
  styleUrls: ['./dialog-actualizar-op-certificadas.component.css']
})
export class DialogActualizarOpCertificadasComponent implements OnInit {

  form: FormGroup;
  valorTotal: number;
  estado: string;
  dataSourceInfoOpCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>;
  displayedColumnsInfoOpCertificadas: string[] = ['idCertificacion', 'nombreFondoTDV', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'fechaEjecucion', 'entradaSalida', 'valorTotal', 'valorFaltante', 'valorSobrante'];
  dataElement: any;

  estados: Estado[] = [
    { value: 'cancelada-1', viewValue: 'CANCELADA' },
    { value: 'no_conciliado-2', viewValue: 'NO_CONCILIADA' },
    { value: 'fallida-3', viewValue: 'FALLIDA' },
    { value: 'pospuesta-4', viewValue: 'POSPUESTA' },
    { value: 'fuera_de_conciliacion-4', viewValue: 'FUERA_DE_CONCILIACION' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConciliacionesCertificadaNoConciliadasModel,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogActualizarOpCertificadasComponent>,
    private opConciliadasService: OpConciliadasService,) {
    this.dataSourceInfoOpCertificadas = new MatTableDataSource([data]);
  }

  ngOnInit(): void {
    this.dataElement = this.data;
    this.initForm(this.dataElement);
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
      idCertificacion: this.data.idCertificacion,
      estado: this.form.value['estadoConciliacion'].viewValue,
      valor: this.form.value['valorTotal']
    }
    this.opConciliadasService.actualizarOpCertificadas(estadoActualizar).subscribe({
      next: (page: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "Se realizo la actualización exitosamente",
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3500);
        this.dialogRef.close({ data: page });
      },
      error: (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_MODIFICACION + " - " + err.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      }
    });
  }

}

interface Estado {
  value: string;
  viewValue: string;
}
