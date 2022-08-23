import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-tabla-dominio',
  templateUrl: './dialog-tabla-dominio.component.html',
  styleUrls: ['./dialog-tabla-dominio.component.css']
})
export class DialogTablaDominioComponent implements OnInit {

  contenido: string;
  tipoContenido: string[] = ['Texto', 'Númerico', 'Fecha'];

  estado: string;
  tipoEstado: string[] = ['Dominio en uso', 'Dominio no esta en uso'];

  constructor() { }

  ngOnInit(): void {
  }

}