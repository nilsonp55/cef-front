import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-emergente-response',
  templateUrl: './ventana-emergente-response.component.html'
})
export class VentanaEmergenteResponseComponent implements OnInit {

  msn: string = 'Mensaje de prueba';
  codigoIcono: number = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {msn: string, codigo: number}) { }

  imgError: string = 'assets/img/error.jpg';
  imgAlerta: string = 'assets/img/waring.jpg';
  imgExistoso: string = 'assets/img/succesfull.png';
  imgEsperar: string = 'assets/img/esperar.png';

  ngOnInit(): void {
  }

}
