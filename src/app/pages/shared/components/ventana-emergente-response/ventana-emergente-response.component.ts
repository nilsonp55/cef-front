import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-emergente-response',
  templateUrl: './ventana-emergente-response.component.html',
  styleUrls: ['./ventana-emergente-response.component.css'],
})
export class VentanaEmergenteResponseComponent implements OnInit {
  msn: string = 'Mensaje de prueba';
  codigoIcono: number = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      msn: string;
      codigo: number;
      showActions?: boolean;
      msgDetalles?: string;
      showResume?: boolean;
    },
    public dialogRef: MatDialogRef<VentanaEmergenteResponseComponent>
  ) {}

  imgError: string = 'assets/img/error.jpg';
  imgAlerta: string = 'assets/img/waring.jpg';
  imgExistoso: string = 'assets/img/succesfull.png';
  imgEsperar: string = 'assets/img/esperar.png';

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
