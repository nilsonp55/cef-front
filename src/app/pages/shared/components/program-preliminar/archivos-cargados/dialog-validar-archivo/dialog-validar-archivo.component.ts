import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogResultValidacionComponent } from '../dialog-result-validacion/dialog-result-validacion.component';

@Component({
  selector: 'app-dialog-validar-archivo',
  templateUrl: './dialog-validar-archivo.component.html',
  styleUrls: ['./dialog-validar-archivo.component.css']
})
export class DialogValidarArchivoComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
