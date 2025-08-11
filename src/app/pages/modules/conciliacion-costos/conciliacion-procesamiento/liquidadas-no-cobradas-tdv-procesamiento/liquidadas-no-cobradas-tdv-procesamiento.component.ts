import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import Swal from 'sweetalert2';
import { VentanaEmergenteProcesamientoComponent } from '../ventana-emergente-procesamiento/ventana-emergente-procesamiento.component';

@Component({
  selector: 'app-liquidadas-no-cobradas-tdv-procesamiento',
  templateUrl: './liquidadas-no-cobradas-tdv-procesamiento.component.html',
  styleUrls: ['./liquidadas-no-cobradas-tdv-procesamiento.component.css']
})
export class LiquidadasNoCobradasTdvComponentProcesamiento implements OnInit {

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
    tipoTabla: 'liquidadas'
  };

  load: boolean = false;
  moment: any = 1;

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliacionCostosService,
  ) {
    this.datosTabla.nombreArchivoExportar = 'Liquidadas-No-Cobradas-TDV-Procesamiento';
    this.datosTabla.botones = ['Eliminar', 'Rechazar'];
    this.datosTabla.mostrarExportar = true;
  }

  ngOnInit(): void {
    this.datosTabla.fuenteDatosTabla = []
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filtro && changes.hasOwnProperty("filtro") && this.idTab == 2) {
      let filtroProcesado = this.filtro;
      for (const key in filtroProcesado) {
        if (filtroProcesado[key] == undefined) {
          delete filtroProcesado[key]
        }
      }
      this.ConsultarDatosLiquidadasNoCobradas(filtroProcesado, 0, 0);
    }
  }

  async ConsultarDatosLiquidadasNoCobradas(filtroProcesado, pagina, tamanio) {
    this.load = true;
    filtroProcesado["page"] = pagina;
    filtroProcesado["size"] = tamanio;
    this.opConciliadasService.obtenerLiquidadasNoCobradasTDVProcesamiento(
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
      this.eliminarRechazar(event);
  }

  eliminarRechazar(event) {
    if (event.items.length === 0) {
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
      const alert = this.dialog.open(VentanaEmergenteProcesamientoComponent, {
        width: "800px",
        data: {
          msn: event.items,
          event: 'liquidadas_' + event.texto.toLowerCase()
        },
        disableClose: true,
      });
      alert.afterClosed().subscribe(result => {
        if (result !== "cancelar") {
          this.moment = result
          this.ConsultarDatosLiquidadasNoCobradas(this.filtro,0,0);
          setTimeout(() => {
          }, 2000);
        }
      });
    }
  }

}
