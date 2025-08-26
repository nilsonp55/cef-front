import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteDesconciliarComponent } from './ventana-emergente-desconciliar/ventana-emergente-desconciliar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conciliadas',
  templateUrl: './conciliadas.component.html',
  styleUrls: ['./conciliadas.component.css']
})
export class ConciliadasComponent implements OnInit {

  @Input() filtro;
  @Input() idTab;
  datosTabla: {
    tamanoPagina?: number,
    totalRegistros?: number,
    nombreArchivoExportar?: string,
    fuenteDatosTabla?: any,
    botones?: string[]
  } = {};

  load: boolean = false;
  moment: any = 1;

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliacionCostosService,
  ) {
    this.datosTabla.nombreArchivoExportar = 'Conciliadas-Transporte';
    this.datosTabla.botones = ['Exportar tabla', 'Desconciliar'];
  }

  ngOnInit(): void {
    this.datosTabla.fuenteDatosTabla = []
    this.datosTabla.botones = ['Exportar tabla', 'Desconciliar'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filtro && changes.hasOwnProperty("filtro") && this.idTab == 0) {
      let filtroProcesado = this.filtro;
      for (const key in filtroProcesado) {
        if (filtroProcesado[key] == undefined) {
          delete filtroProcesado[key]
        }
      }
      this.ConsultarDatosConciliadas(filtroProcesado, 0, 0);
    }
  }

  async ConsultarDatosConciliadas(filtroProcesado, pagina, tamanio) {
    this.load = true;
    filtroProcesado["page"] = pagina
    filtroProcesado["size"] = tamanio
    this.opConciliadasService.obtenerConciliadasTransporte(
      filtroProcesado
    ).subscribe({
      next: (page: any) => {
        if (page.data.content.length !== 0) {
          this.datosTabla.fuenteDatosTabla = page.data;
          this.datosTabla.totalRegistros = page.data.totalElements;
          this.datosTabla.botones = ['Exportar tabla', 'Desconciliar'];
          this.load = false;
        } else {
          Swal.fire({
            title: "No existen registros que coincidan con los filtros seleccionados",
            imageUrl: "assets/img/waring.jpg",
            imageWidth: 80,
            imageHeight: 80,
            confirmButtonText: "Aceptar",
            showConfirmButton: true,
            allowOutsideClick: false,
            customClass: { popup: "custom-alert-swal-text" }
          }).then((result) => {
            this.datosTabla.fuenteDatosTabla = [];
            this.datosTabla.botones = ['Exportar tabla', 'Desconciliar'];
            this.load = false;
            Swal.close();
          });
        }
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
        this.load = false;
      }
    });
  }

  eventoBotones(event: any) {
    if (event.texto == this.datosTabla.botones[0]) {
      this.desconciliar(event.items);
    }
  }

  eventoPaginacion(e: any) {
    this.ConsultarDatosConciliadas(this.filtro, e.numPagina, e.cantPagina);
  }


  desconciliar(event) {
    if (event.length === 0) {
      Swal.fire({
        title: "Seleccione al menos un registro de la tabla",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false,
        customClass: { popup: "custom-alert-swal-text" }
      }).then((result) => {
        Swal.close();
      });
    } else {
      const alert = this.dialog.open(VentanaEmergenteDesconciliarComponent, {
        width: "800px",
        data: {
          msn: event
        },
        disableClose: true,
      });
      alert.afterClosed().subscribe(result => {
        if (result !== "cancelar") {
          this.moment = result
          this.ConsultarDatosConciliadas(this.filtro, 0, 0);
        }
      });
    }
  }

}
