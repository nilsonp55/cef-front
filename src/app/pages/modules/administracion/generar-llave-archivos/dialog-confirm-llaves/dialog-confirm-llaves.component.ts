import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-dialog-confirm-llaves',
  templateUrl: './dialog-confirm-llaves.component.html'
})
export class DialogConfirmLlavesComponent implements OnInit {

  tipoContabilidad: any;
  bancos: any;
  fechaSistemaSelect: any;
  bancoSelect: any;


  constructor(
    private readonly dialogRef: MatDialogRef<DialogConfirmLlavesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoContabilidad: string }
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
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
