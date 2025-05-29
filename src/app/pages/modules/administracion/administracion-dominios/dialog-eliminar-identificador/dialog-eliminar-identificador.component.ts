import { Component, OnInit } from '@angular/core';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-dialog-eliminar-identificador',
  templateUrl: './dialog-eliminar-identificador.component.html',
  styleUrls: ['./dialog-eliminar-identificador.component.css']
})
export class DialogEliminarIdentificadorComponent implements OnInit {

  estado: string;
  tipoEstado: string[] = ['Identificador en uso', 'Identificador no esta en uso'];

  constructor() { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
  }

}
