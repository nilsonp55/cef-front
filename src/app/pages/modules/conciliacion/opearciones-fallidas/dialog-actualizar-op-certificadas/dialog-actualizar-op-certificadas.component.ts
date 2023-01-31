import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/_model/error.model';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
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
  datoqueLlega: any;
  dataElement: any;
  comparador: string;
  listarONo: string;

  @HostListener("document:keydown", ['$event.key'])
  handler_test($event: string) {
    console.log($event)
  }

  @HostListener("document:click", ['$event.target'])
  handler_name($event: HTMLElement) {
    if ($event.classList.toString() == 'cdk-overlay-backdrop cdk-overlay-dark-backdrop') {
      this.listarONo = "N"
      //alert("Click por fuera")
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConciliacionesCertificadaNoConciliadasModel,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogActualizarOpCertificadasComponent>,
    private opConciliadasService: OpConciliadasService,) {
    this.dataSourceInfoOpCertificadas = new MatTableDataSource([data]);
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

  actualizarEstado() {
    var actualizarRequest: any = {
      idCertificacion: this.data.idCertificacion
    }
    if (this.valorTotal) {
      actualizarRequest.valorTotal = this.valorTotal
    }
    if (this.estado) {
      actualizarRequest.estado = this.estado
    }
    this.opConciliadasService.actualizarOpCertificadas(actualizarRequest).subscribe((page: any) => {
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
      idOperacion: this.data.idCertificacion,
      estado: this.form.value['estadoConciliacion'].viewValue,
      valor: this.form.value['valorTotal']
    }
    this.opConciliadasService.actualizarOpCertificadas(estadoActualizar).subscribe((page: any) => {debugger
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

  close() {
    this.dialogRef.close({ 
      event: 'Cancel',
      data: {
        listar: this.listarONo
      }
    })
  }

  eventoClickXFuera() {
    if (this.comparador=='cdk-overlay-backdrop cdk-overlay-dark-backdrop') {
      this.listarONo = "S"
    }
  }

 

}

interface Estado {
  value: string;
  viewValue: string;
}
