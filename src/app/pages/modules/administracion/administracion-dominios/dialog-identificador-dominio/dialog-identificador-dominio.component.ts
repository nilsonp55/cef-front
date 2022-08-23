import { Component, OnInit } from '@angular/core';

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
  }
}
