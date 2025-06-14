import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ErroresCampos } from 'src/app/_model/cargue-preliminar-model/error-campo.model';
import { ValidacionLineaArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-linea-archivo.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';

@Component({
  selector: 'app-dialog-result-validacion',
  templateUrl: './dialog-result-validacion.component.html',
  styleUrls: ['./dialog-result-validacion.component.css']
})

/**
 * Clas para gestinor la validacion del archivo y visulizar su resultado 
 * @BaironPerez
 */
export class DialogResultValidacionComponent implements OnInit {

  tablaValidacionError: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private  cargueArchivosService: CargueArchivosService
  ) { }

  
  ngOnInit(): void { 
    //Logica para convertir Json de respuesta y adaptarlo a la ventana emergent

    if(this.data.data.data.numeroErrores != null || this.data.data.data.numeroErrores > 0) {
      this.data.data.data.validacionLineas.forEach((validacionLineasItem: ValidacionLineaArchivo) => {
        validacionLineasItem.campos.forEach((campItem: ErroresCampos) => {
          const tablaValidacionError = { 
            linea: validacionLineasItem.numeroLinea,
            campo: campItem.numeroCampo,
            descripcion: campItem.mensajeError,
            contenido: campItem.contenido
          };
          this.tablaValidacionError.push(tablaValidacionError);
        });
      });
    }
  }


  //Historico vioene el idData

  descargarArchivo() {
    if (this.data.idData==undefined){
      this.cargueArchivosService.visializarArchivo3({
        'nombreArchivo': this.data.data.data.nombreArchivo,
        'idMaestroArchivo': this.data.id
      }).subscribe(blob =>{
        blob.saveFile();
      })
    }else {
      this.cargueArchivosService.visializarArchivo4({
        'idArchivo':this.data.idData,
        'nombreArchivo': this.data.data.data.nombreArchivo
      }).subscribe(blob =>{
        blob.saveFile();
      })
    }
    
  }

}
