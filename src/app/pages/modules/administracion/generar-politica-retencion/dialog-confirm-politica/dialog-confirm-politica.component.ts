import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-dialog-confirm-politica',
  templateUrl: './dialog-confirm-politica.component.html',
  styleUrls: ['./dialog-confirm-politica.component.css']
})
export class DialogConfirmPoliticaComponent implements OnInit {

  constructor(
    private readonly dialogRef: MatDialogRef<DialogConfirmPoliticaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoContabilidad: string }
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
