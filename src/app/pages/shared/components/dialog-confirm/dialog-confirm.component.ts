import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html'
})
export class DialogConfirmComponent implements OnInit {

  title: string = "¿Desea confirmar la acción?"

  constructor(
    private readonly dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, menssage: string }
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
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
