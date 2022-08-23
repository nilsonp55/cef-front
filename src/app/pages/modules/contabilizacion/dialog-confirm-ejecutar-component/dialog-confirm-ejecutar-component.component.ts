import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-confirm-ejecutar-component',
  templateUrl: './dialog-confirm-ejecutar-component.component.html',
  styleUrls: ['./dialog-confirm-ejecutar-component.component.css']
})
export class DialogConfirmEjecutarComponentComponent implements OnInit {

  bancos: any;
  fechaSistemaSelect: any;
  bancoSelect: any;


  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private dialogRef: MatDialogRef<DialogConfirmEjecutarComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoContabilidad: string }
  ) { }

  ngOnInit(): void {
    this.cargarDatosDesplegables();
  }

  async cargarDatosDesplegables() {
    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _fecha = await this.generalServices.listarDominioByDominio("FECHA_DIA_PROCESO").toPromise();
    this.fechaSistemaSelect = _fecha
  }

  confirm() {
    this.dialogRef.close({
      data: {
        banco: this.bancoSelect,
        fechaSistema: this.fechaSistemaSelect,
        check: true
      }
    })
  }

  cancel() {
    this.dialogRef.close({
      data: {
        banco: this.bancoSelect,
        fechaSistema: this.fechaSistemaSelect,
        check: true
      }
    })
  }
  
}
