import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-log-archivo-cargado-definitivo',
  templateUrl: './log-archivo-cargado.component.html',
  styleUrls: ['./log-archivo-cargado.component.css']
})

/**
 * Componente para gestionar el log de cargue de la programación preliminar
 * @BaironPerez
*/
export class LogArchivoCargadoDefinitivoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,  
  ) { }

  ngOnInit(): void {
  }

}
