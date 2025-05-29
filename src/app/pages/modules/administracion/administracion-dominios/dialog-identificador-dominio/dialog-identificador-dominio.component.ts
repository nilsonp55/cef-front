import { Component, OnInit } from '@angular/core';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-dialog-identificador-dominio',
  templateUrl: './dialog-identificador-dominio.component.html',
  styleUrls: ['./dialog-identificador-dominio.component.css']
})
export class DialogIdentificadorDominioComponent implements OnInit {

  estado: string;
  tipoEstado: string[] = ['Identificador en uso', 'Identificador no esta en uso'];

  constructor() { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
  }
}
