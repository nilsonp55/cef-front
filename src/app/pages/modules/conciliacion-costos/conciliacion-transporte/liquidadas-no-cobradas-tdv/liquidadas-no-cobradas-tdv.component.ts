import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import Swal from 'sweetalert2';
import { VentanaEmergenteAceptarRechazarComponent } from '../cobradas-tdv-no-identificadas/ventana-emergente-aceptar-rechazar/ventana-emergente-aceptar-rechazar.component';
import { VentanaEmergenteEliminarRechazarTComponent } from './ventana-emergente-eliminar-rechazar-t/ventana-emergente-eliminar-rechazar-t.component';

@Component({
  selector: 'app-liquidadas-no-cobradas-tdv',
  templateUrl: './liquidadas-no-cobradas-tdv.component.html',
  styleUrls: ['./liquidadas-no-cobradas-tdv.component.css']
})
export class LiquidadasNoCobradasTdvComponent implements OnInit {

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
    this.datosTabla.nombreArchivoExportar = 'Liquidadas-No-Cobradas-TDV-Transporte';
    this.datosTabla.botones = ['Exportar tabla', 'Eliminar', 'Rechazar'];
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
      this.ConsultarDatosLiquidadasNoCobradasTDV(filtroProcesado, 0, 0);
    }
  }

  async ConsultarDatosLiquidadasNoCobradasTDV(filtroProcesado, pagina, tamanio) {
    this.load = true;
    filtroProcesado["page"] = pagina
    filtroProcesado["size"] = tamanio
    this.opConciliadasService.obtenerLiquidadasNoCobradas(
      filtroProcesado
    ).subscribe({
      next: (page: any) => {
        if (page.data.content.length !== 0) {
          this.datosTabla.fuenteDatosTabla = page.data;
          this.datosTabla.totalRegistros = page.data.totalElements;
          this.datosTabla.botones = ['Exportar tabla', 'Eliminar', 'Rechazar'];
          this.load = false;
        } else {
          Swal.fire({
            title: "No existen registros que coincidan con los filtros seleccionados",
            imageUrl: "assets/img/waring.jpg",
            imageWidth: 80,
            imageHeight: 80,
            confirmButtonText: "Aceptar",
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((result) => {
            this.datosTabla.fuenteDatosTabla = [];
            this.datosTabla.botones = ['Exportar tabla', 'Eliminar', 'Rechazar'];
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
    this.eliminarRechazar(event)
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
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
      });
    } else {
      if (event.items.length > 0) {
        event = event
      }
      const alert = this.dialog.open(VentanaEmergenteEliminarRechazarTComponent, {
        width: "800px",
        data: {
          msn: event
        },
        disableClose: true,
      });
      alert.afterClosed().subscribe(result => {
        if (result !== "cancelar") {
          this.ConsultarDatosLiquidadasNoCobradasTDV(this.filtro, 0, 0)
        }
      });
    }
  }

}
