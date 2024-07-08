import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import Swal from 'sweetalert2';
import { VentanaEmergenteProcesamientoComponent } from '../ventana-emergente-procesamiento/ventana-emergente-procesamiento.component';

@Component({
  selector: 'app-cobradas-tdv-no-identificadas-procesamiento',
  templateUrl: './cobradas-tdv-no-identificadas-procesamiento.component.html',
  styleUrls: ['./cobradas-tdv-no-identificadas-procesamiento.component.css']
})
export class CobradasTdvNoIdentificadasProcesamientoComponent implements OnInit, OnChanges {

  @Input() filtro;
  @Input() idTab;
  datosTabla: {
    tamanoPagina?: number,
    totalRegistros?: number,
    nombreArchivoExportar?: string,
    fuenteDatosTabla?: any,
    botones?: string[],
    mostrarExportar: boolean,
    tipoTabla: string
  } = {
    mostrarExportar: false,
    tipoTabla: 'cobradasTDV'
  };
  load: boolean = false;
  moment: any = 1;

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliacionCostosService,
  ) {
    this.datosTabla.nombreArchivoExportar = 'TDV-No-Identificadas-Procesamiento';
    this.datosTabla.botones = ['Aceptar', 'Rechazar'];
    this.datosTabla.mostrarExportar = true;
  }

  ngOnInit(): void {
    this.datosTabla.fuenteDatosTabla = []
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filtro && changes.hasOwnProperty("filtro") && this.idTab == 1) {
      let filtroProcesado = this.filtro;
      for (const key in filtroProcesado) {
        if (filtroProcesado[key] == undefined) {
          delete filtroProcesado[key]
        }
      }
      this.ConsultarDatosCobradasNoIdentifiacadasTDV(filtroProcesado, 0, 0);
    }
  }

  async ConsultarDatosCobradasNoIdentifiacadasTDV(filtroProcesado, pagina, tamanio) {
    this.load = true;
    filtroProcesado["page"] = pagina
    filtroProcesado["size"] = tamanio

    this.opConciliadasService.obtenerCobradasTDVNoIdentificadasProcesamiento(
      filtroProcesado
    ).subscribe({
      next: (page: any) => {
        if(page.data.content.length !== 0){
          this.datosTabla.fuenteDatosTabla = page.data;
          this.datosTabla.totalRegistros = page.data.totalElements;
          this.load = false;
        } else {
          this.datosTabla.fuenteDatosTabla = [];
          this.datosTabla.totalRegistros = 0;
          Swal.fire({
            title: "No existen registros que coincidan con los filtros seleccionados",
            imageUrl: "assets/img/waring.jpg",
            imageWidth: 80,
            imageHeight: 80,
            confirmButtonText: "Aceptar",
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((result) => {
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
    this.aceptarRechazar(event);
  }

  aceptarRechazar(event) {
    if (event.items.length === 0) {
      Swal.fire({
        title: "Seleccione al menos un registro de la tabla",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
      });
    } else {
      if (event.length > 0) {
        event = event
      }
      const alert = this.dialog.open(VentanaEmergenteProcesamientoComponent, {
        width: "800px",
        data: {
          msn: event.items,
          event: 'cobradas_' + event.texto.toLowerCase()
        },
        disableClose: true,
      });
      alert.afterClosed().subscribe(result => {
        if (result !== "cancelar") {
          this.moment = result
          this.ConsultarDatosCobradasNoIdentifiacadasTDV(this.filtro, 0, 0)
          setTimeout(() => {
          }, 2000);
        }
      });
    }
  }
}

