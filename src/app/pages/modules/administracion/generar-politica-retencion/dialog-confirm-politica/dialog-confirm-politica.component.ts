import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-politica',
  templateUrl: './dialog-confirm-politica.component.html',
  styleUrls: ['./dialog-confirm-politica.component.css']
})
export class DialogConfirmPoliticaComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogConfirmPoliticaComponent>,
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
