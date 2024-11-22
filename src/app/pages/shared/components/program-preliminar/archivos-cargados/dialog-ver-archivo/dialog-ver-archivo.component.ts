import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';

@Component({
  selector: 'app-dialog-ver-archivo',
  templateUrl: './dialog-ver-archivo.component.html',
  styleUrls: ['./dialog-ver-archivo.component.css']
})
export class DialogVerArchivoComponent implements OnInit {

  respuesta: String;

  constructor(
    private cargueArchivosService: CargueArchivosService,
    @Inject(MAT_DIALOG_DATA) public data: String) {
    this.respuesta= data;
    }

  ngOnInit(): void {
    this.downloadFile(this.respuesta);
  }

  downloadFile(archivo: any): void {
      this.cargueArchivosService.visializarArchivo2({
        'nombreArchivo': archivo.nombreArchivo,
        'idMaestroArchivo': archivo.idModeloArchivo,
      }).subscribe(blob => {
        this.respuesta=blob;
      });

  }

}
