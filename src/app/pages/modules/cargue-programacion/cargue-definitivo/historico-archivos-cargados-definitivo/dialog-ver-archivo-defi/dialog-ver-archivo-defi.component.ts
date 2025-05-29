import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErroresCampos } from 'src/app/_model/cargue-preliminar-model/error-campo.model';
import { ValidacionLineaArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-linea-archivo.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';

@Component({
  selector: 'app-dialog-ver-archivo-defi',
  templateUrl: './dialog-ver-archivo-defi.component.html',
  styleUrls: ['./dialog-ver-archivo-defi.component.css']
})
export class DialogVerArchivoDefiComponent implements OnInit {

  tablaValidacionError: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly cargueArchivosService: CargueArchivosService
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

  descargarArchivo() {
    this.cargueArchivosService.visializarArchivo4({
      'idArchivo': this.data.idData
    }).subscribe(blob =>{
      blob.saveFile();
    })
  }

}
