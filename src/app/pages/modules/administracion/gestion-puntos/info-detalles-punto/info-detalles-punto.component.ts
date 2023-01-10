import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-info-detalles-punto',
  templateUrl: './info-detalles-punto.component.html',
  styleUrls: ['./info-detalles-punto.component.css']
})
export class InfoDetallesPuntoComponent implements OnInit {

  vacio: any = "ESto";
  dataSourceInfoDetallesPunto: MatTableDataSource<any>;
  displayedColumnsInfoDetallesPunto: string[] = ['bancos','cajeroATM','codigoCiudad', 'codigoPunto', 'fondos', 'nombrePunto', 'oficinas', 'puntosCodigoTDV', 'sitiosClientes', 'tipoPunto'];
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.dataSourceInfoDetallesPunto = new MatTableDataSource([data]);
  }

  ngOnInit(): void {
  }



}
