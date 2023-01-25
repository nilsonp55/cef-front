import { Component, OnInit } from '@angular/core';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-modificar-punto',
  templateUrl: './modificar-punto.component.html',
  styleUrls: ['./modificar-punto.component.css']
})
export class ModificarPuntoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
  }

}
