import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-log-certificacion',
  templateUrl: './log-certificacion.component.html',
  styleUrls: ['./log-certificacion.component.css']
})

/**
 * Clase para representar el detalle de los archivos cargados 
 * @BaironPerez
 */
export class LogArchivosCargadosCertificacionComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,  
  ) { }

  ngOnInit(): void {
  }

}
