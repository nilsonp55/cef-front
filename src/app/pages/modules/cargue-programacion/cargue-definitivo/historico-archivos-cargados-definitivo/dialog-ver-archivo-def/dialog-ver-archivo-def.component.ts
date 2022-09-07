import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErroresCampos } from 'src/app/_model/cargue-preliminar-model/error-campo.model';
import { ValidacionLineaArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-linea-archivo.model';
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
    private cargueArchivosService: CargueArchivosService
  ) { 
    this.tablaValidacionError=data.tableData
    this.tableData=data.tableData
    this.prueba=this.tableData.length
    console.log(data.tableData);
  }


  ngOnInit(): void { 
    //Logica para convertir Json de respuesta y adaptarlo a la ventana emergent
    console.log(this.data)
    console.log(this.data.idModArch)
    console.log(this.data.data.data.nombreArchivo)
    console.log(this.data.data.data.validacionLineas)
   
    /*if(this.data.data.data.numeroErrores != null || this.data.data.data.numeroErrores > 0) {
      this.data.data.data.validacionLineas.forEach((validacionLineasItem: ValidacionLineaArchivo) => {
        validacionLineasItem.campos.forEach((campItem: ErroresCampos) => {
          console.log(validacionLineasItem)
          console.log("------")
          const tablaValidacionError = { 
            linea: validacionLineasItem.numeroLinea,
            campo: campItem.numeroCampo,
            descripcion: campItem.mensajeError,
            contenido: campItem.contenido
          };
          console.log(tablaValidacionError)
          console.log(campItem.numeroCampo)
          this.tablaValidacionError.push(tablaValidacionError);
        });
      });
      console.log(this.tablaValidacionError)
    }*/
  }

  descargarArchivo() {
    this.cargueArchivosService.visializarArchivo4({
      'adArchivo': this.data.data.data.nombreArchivo,
      'idMaestroArchivo': this.data.idModArch
    }).subscribe(blob =>{
      blob.saveFile();
    })
  }

}
