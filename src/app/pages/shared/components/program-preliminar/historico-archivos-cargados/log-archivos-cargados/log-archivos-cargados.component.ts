import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-log-archivos-cargados',
  templateUrl: './log-archivos-cargados.component.html',
  styleUrls: ['./log-archivos-cargados.component.css']
})

/**
 * Componente para gestionar el log de cargue de la programación preliminar
 * @BaironPerez
*/
export class LogArchivosCargadosComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,  
  ) { }

  ngOnInit(): void { 
    this.data;
  }

}
