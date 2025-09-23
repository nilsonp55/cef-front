import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GenerarPoliticaService } from 'src/app/_service/administracion-service/generar-politica.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import Swal from 'sweetalert2';
import { DialogConfirmComponent } from 'src/app/pages/shared/components/dialog-confirm/dialog-confirm.component';
import { ProcedimientosAlmacenadosService } from 'src/app/_service/administracion-service/procedimientos-almacenados.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-conciliar-nuevos-puntos-tdv',
  templateUrl: './conciliar-nuevos-puntos-tdv.component.html'
})
export class ConciliarNuevosPuntosTdvComponent implements OnInit {

  displayedColumnsLogProceso: string[] = ['logProceso'];

  dataSourceLogProceso: MatTableDataSource<any>;
  logProceso: any[] = [];

  idFuncion: string = '11';
  parametro: string = '1';


  constructor(
    private readonly procedimientosAlmacenadosService: ProcedimientosAlmacenadosService,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
  }

  private modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    });
  }

  conciliar() {
    const alert = this.dialog.open(DialogConfirmComponent, {
      width: '750px',
      data: {
        title: "¿Desea conciliar los nuevos puntos TDV?"
      }
    });
    alert.afterClosed().subscribe(result => {
      if (result.data.check) {
        this.modalProcesoEjecucion();
        this.ejecutarProcedimiento();
      }
    })
  }

  private ejecutarProcedimiento() {
    this.limpiarData()
    const body = {
      "idFuncion": this.idFuncion,
      "parametros": this.parametro
    }
    this.procedimientosAlmacenadosService.guardarProcedimientos(body).subscribe({
      next: (resp) => {
        Swal.close();
        if (resp.data.length == 0) {
          this.onAlert("No se generó registros para el proceso ejecutado");
        } else {
          this.procesarRespuesta(resp);
          this.onAlert(GENERALES.MESSAGE_ALERT.MESSAGE_PROCESS.COMPLETED_PROCESS, GENERALES.CODE_EMERGENT.SUCCESFULL);
        }
      },
      error: (err: any) => {
        Swal.close();
        this.onAlert(err.error.response.description, GENERALES.CODE_EMERGENT.ERROR);
      }
    })
  }

  private procesarRespuesta(data: any): void {
    try {
      for (let i = 1; i < data.data.length; i++) {
        let resp = data.data[i].split(',');
        this.recrearTabla(resp);
      }
    } catch (error) {
      this.onAlert("Error procesando data de respuesta", GENERALES.CODE_EMERGENT.ERROR)
    }
    this.asignarDatosTablas();
  }

  limpiarData() {
    this.logProceso = [];
    this.asignarDatosTablas();
  }

  asignarDatosTablas() {
    this.dataSourceLogProceso = new MatTableDataSource(this.logProceso);
  }

  private recrearTabla(resp: any) {
    if (resp.length == 1) {
      const object = {
        logProceso: resp[0]
      }
      this.logProceso.push(object);
    }

  }

  private onAlert(mensaje: string, codigo = GENERALES.CODE_EMERGENT.WARNING) {
    this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: mensaje,
        codigo: codigo,
      },
    });
  }
}
