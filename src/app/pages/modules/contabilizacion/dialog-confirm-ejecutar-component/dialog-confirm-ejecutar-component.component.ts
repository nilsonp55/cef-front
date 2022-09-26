import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/_model/error.model';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { GeneralesService } from 'src/app/_service/generales.service';

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

  valorBanco: any = "0";


  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private generarContabilidadService: GenerarContabilidadService,
    private dialogRef: MatDialogRef<DialogConfirmEjecutarComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoContabilidad: string }
  ) { }

  ngOnInit(): void {
    this.tipoContabilidad = this.data.tipoContabilidad;
    this.cargarDatosDesplegables();
  }



  async cargarDatosDesplegables() {
    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
    this.fechaSistemaSelect = _fecha.data[0].valor;
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
      data: {
        banco: '0',
        fechaSistema: this.fechaSistemaSelect,
        check: true
      }
    })
  }
  
}
