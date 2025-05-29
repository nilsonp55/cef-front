import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-validar-archivo',
  templateUrl: './dialog-validar-archivo.component.html'
})
export class DialogValidarArchivoComponent implements OnInit {

  nombreArchivo: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
   this.nombreArchivo = this.data.nombreArchivo;
  }

}
