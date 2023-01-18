import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/_model/error.model';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-confirm-llaves',
  templateUrl: './dialog-confirm-llaves.component.html',
  styleUrls: ['./dialog-confirm-llaves.component.css']
})
export class DialogConfirmLlavesComponent implements OnInit {

  tipoContabilidad: any;
  bancos: any;
  fechaSistemaSelect: any;
  bancoSelect: any;


  constructor(
    private generalServices: GeneralesService,
    private dialogRef: MatDialogRef<DialogConfirmLlavesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoContabilidad: string }
  ) { }

  ngOnInit(): void {
  }

  confirm() {
    this.dialogRef.close({
      data: {
        check: true
      }
    })
  }

  cancel() {
    this.dialogRef.close({
      data: {
        check: false
      }
    })
  }

}
