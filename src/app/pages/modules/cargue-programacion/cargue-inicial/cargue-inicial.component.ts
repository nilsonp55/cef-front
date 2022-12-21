import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';

@Component({
  selector: 'app-cargue-inicial',
  templateUrl: './cargue-inicial.component.html',
  styleUrls: ['./cargue-inicial.component.css']
})

/**
 * Componente para realizar el cargue de los archivos
 * @BaironPerez
*/
export class CargueInicialComponent implements OnInit {
  
  @Input() tipoCargue: any;
  public fileList: File[] = [];

  @ViewChild('inputFile', { static: false }) public inputFile: ElementRef;

  constructor(
    private cargueArchivosService: CargueArchivosService,
    private dialog: MatDialog,
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

      const formData: FormData = new FormData();
        for (const file of this.fileList) {
            formData.append('file', file, file.name);
        }
      this.cargueArchivosService.saveFile(this.fileList, this.tipoCargue).subscribe(data => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
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
