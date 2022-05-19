import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';

@Component({
  selector: 'app-carga-archivos',
  templateUrl: './carga-archivos.component.html',
  styleUrls: ['./carga-archivos.component.css']
})

/**
 * Componente para realizar el cargue de los archivos
 * @BaironPerez
*/
export class CargaArchivosComponent implements OnInit {

  public fileList: File[] = [];

  @ViewChild('inputFile', { static: false }) public inputFile: ElementRef;

  constructor(
    private cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private dialog: MatDialog,
    private cargueArchivosService: CargueArchivosService
    ) { }

    
  ngOnInit(): void {
  }

  /**
   * Metodo encargado de procesar y guarda el archivo en una dirección especifica
   * @BaironPerez
   */
   public fileChange(target: EventTarget): void {
    let validSize = true;
    let validName = true;
    let files: File[] = target['files'];
    Array.from(files).forEach(f => {
      // Setear desde propieadades de bd
      if (f.size > 10000000) {
        validSize = false;
      }
      if (f.name.length > 100) {
        validName = false;
      }
    });
    if (!validSize) {
      console.log('Mensaje de documeno excede el tamaño')
    } else if (!validName) {
      console.log('Mensaje de nombre de documeno excede el tamaño')
    } else {
      Array.from(files).forEach(f => {
        this.fileList = this.fileList.filter(temp => temp.name !== f.name);
        this.fileList.push(f);
      });
      this.cargueArchivosService.saveFile(this.fileList).subscribe(data => {
        console.log('ya guardo perrrosssss!!!');
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: '480px',
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.SUCCESFULL_UPLOAD_FILE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
      });
    }
    this.inputFile.nativeElement.value = null;
  }

}