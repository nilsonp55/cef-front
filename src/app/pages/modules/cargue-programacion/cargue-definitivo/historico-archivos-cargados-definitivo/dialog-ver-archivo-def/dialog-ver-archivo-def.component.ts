import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';

@Component({
  selector: 'app-dialog-ver-archivo-def',
  templateUrl: './dialog-ver-archivo-def.component.html',
  styleUrls: ['./dialog-ver-archivo-def.component.css']
})
export class DialogVerArchivoDefComponent implements OnInit {

  tablaValidacionError: any[] = [{
    linea: "1",
    campo: "1",
    descripcion: "1",
    contenido: "1"
  }];
  tableData:any[] = []
  prueba : any = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly cargueArchivosService: CargueArchivosService
  ) {
    this.tablaValidacionError=data.tableData
    this.tableData=data.tableData
    this.prueba=this.tableData.length
  }


  ngOnInit(): void {  }

  descargarArchivo() {
    this.cargueArchivosService.visializarArchivo4({
      'adArchivo': this.data.data.data.nombreArchivo,
      'idMaestroArchivo': this.data.idModArch
    }).subscribe(blob =>{
      blob.saveFile();
    })
  }

}
