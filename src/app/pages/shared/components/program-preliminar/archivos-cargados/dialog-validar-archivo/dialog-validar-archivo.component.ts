import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogResultValidacionComponent } from '../dialog-result-validacion/dialog-result-validacion.component';

@Component({
  selector: 'app-dialog-validar-archivo',
  templateUrl: './dialog-validar-archivo.component.html',
  styleUrls: ['./dialog-validar-archivo.component.css']
})
export class DialogValidarArchivoComponent implements OnInit {

  nombreArchivo: string;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
   this.nombreArchivo = this.data.nombreArchivo;
  }

}
