import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { ErrorService } from 'src/app/_model/error.model';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog-confirm-ejecutar-component',
  templateUrl: './dialog-confirm-ejecutar-component.component.html',
  styleUrls: ['./dialog-confirm-ejecutar-component.component.css']
})
export class DialogConfirmEjecutarComponentComponent implements OnInit {

  tipoContabilidad: any;
  bancos: any;
  fechaSistemaSelect: any;
  bancoSelect: any;
  spinnerActive = false;


  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private dialogRef: MatDialogRef<DialogConfirmEjecutarComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoContabilidad: string }
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.tipoContabilidad = this.data.tipoContabilidad;
    this.cargarDatosDesplegables();
  }



  cargarDatosDesplegables() {

    this.spinnerActive = true;
    this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).subscribe( {
      next: (response) =>{
        this.fechaSistemaSelect = response.data[0].valor;
        this.spinnerActive = false;
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerActive = false;
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn:  GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE + 'FECHA_DIA_PROCESO',
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error?.response)
            
          }
        });
      }
    })
  }

  confirm() {
    this.dialogRef.close({
      data: {
        banco: "0",
        fechaSistema: this.fechaSistemaSelect,
        check: true
      }
    })
  }

  cancel() {
    this.dialogRef.close({
      /*data: {
        banco: '0',
        fechaSistema: this.fechaSistemaSelect,
        check: true
      }*/
    })
  }
  
}
