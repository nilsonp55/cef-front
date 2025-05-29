import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';

@Component({
  selector: 'app-ventana-emergente-error',
  templateUrl: './ventana-emergente-error.component.html',
  styleUrls: ['./ventana-emergente-error.component.css']
})
export class VentanaEmergenteErrorComponent implements OnInit {

  dataError: any;
  dataSource = new MatTableDataSource();
  displayedColumnsErrores: string[] = ['linea', 'campo', 'descripcionError', 'contenidoError'];
  numeroErrores: number;
  numeroLineas: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private opConciliacionCostosService: OpConciliacionCostosService, private cargueArchivosService: CargueArchivosService) { }


  ngOnInit(): void {
    this.consultarDetalleError();
    console.log(this.data)
  }

  consultarDetalleError() {
    this.modalProcesoEjecucion()
    this.opConciliacionCostosService.obtenerArchivoDetalleErrorProcesar({
      idArchivoCargado: this.data.msn.idArchivoDB
    }).subscribe({
      next: (response: any) => {
        let campos = []
        let lineas = []
        let lineasCampos = []
        if (response.data !== undefined) {
          lineas = response.data.validacionLineas
          lineas.forEach((element, l) => {
            campos.push(element.campos)
            campos[l].forEach(element => {
              lineasCampos.push(element)
            });
          });
          this.numeroErrores = lineasCampos.length;
          this.numeroLineas = lineas.length
          this.dataSource = new MatTableDataSource(lineasCampos)
          Swal.close();
        }
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "err.error.response.description",
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
        Swal.close();
      }
    });
  }

  modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false
    });
  }


  descargarArchivo() {
    this.modalProcesoEjecucion()
    this.opConciliacionCostosService.descargarArchivoError({
      idArchivo: this.data.msn.idArchivoDB
    }).subscribe({
      next: (response: any) => {
        const blob = new Blob([response.body], { type: 'application/octet-stream' });
        saveAs(blob, this.data.msn.nombreArchivoCompleto);
        Swal.close();
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "err.error.response.description",
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
        Swal.close();
      }
    });
  }
}

