import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralesService } from 'src/app/_service/generales.service';
import { DetalleErrorModalComponent } from './detalle-error-modal/detalle-error-modal.component';
import { TarifasEspecialesService } from 'src/app/_service/liquidacion-service/tarifas-especiales.service';
import Swal from 'sweetalert2';
import { LogArchivosCargadosComponent } from 'src/app/pages/shared/components/program-preliminar/historico-archivos-cargados/log-archivos-cargados/log-archivos-cargados.component';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';

@Component({
  selector: 'app-cargue-masivo-tarifas-especiales',
  templateUrl: './cargue-masivo-tarifas-especiales.component.html',
  styleUrls: ['./cargue-masivo-tarifas-especiales.component.css']
})
export class CargueMasivoTarifasEspecialesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sortTarifas: MatSort;
  cantidadRegistros: any;
  dataSourceCargueTarifas = new MatTableDataSource<any>([]);
  displayedColumnsCargueTarifas: string[] = ['nombreArchivo', 'fechaCargue', 'estado', 'acciones'];
  cargueMasivoList: any;
  cargueMasivoSelect: any;
  buscar: boolean = false;

  constructor(private generalesService: GeneralesService, private dialog: MatDialog, private tarifasEspecialesService: TarifasEspecialesService, private cargueProgramacionPreliminarService: CargueProgramacionPreliminarService) { }

  async ngOnInit(): Promise<void> {
    await this.iniciarDesplegables();
  }

  async iniciarDesplegables() {

    const _cargueMasivo = await await this.generalesService.listarDominioByDominio({
      'dominio': "CARGUE_MASIVO_TABLAS"
    }).toPromise();
    this.cargueMasivoList = _cargueMasivo.data;

  }

  async cargarArchivosCargueTarifas() {
    const _datosArchivos = await this.tarifasEspecialesService.consultarArchivosTarifasEspeciales({
      star: 0,
      end: 0,
      idOption: this.cargueMasivoSelect === 'CARGUE MASIVO DE TARIFAS ESPECIALES CLIENTES' ? 1 : 2
    }).toPromise();
    this.dataSourceCargueTarifas = new MatTableDataSource(_datosArchivos.data?.content);
    this.dataSourceCargueTarifas.sort = this.sort;
    this.dataSourceCargueTarifas.paginator = this.paginator;
    this.cantidadRegistros = _datosArchivos.data?.content.length;
  }

  visualizar(element: any) {

    const elementModificado = { ...element };

    if (elementModificado.fechaArchivo) {
      elementModificado.fechaArchivo = this.convertirFecha(elementModificado.fechaArchivo);
    }

    const dialogRef = this.dialog.open(DetalleErrorModalComponent, {
      width: '1000px',
      maxHeight: "90vh",
      data: {
        element: elementModificado
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        console.log('Guardó cambios', resultado);
      } else {
        console.log('Canceló');
      }
    });
  }


  validarBuscar(event) {
    if (this.cargueMasivoSelect) {
      this.buscar = true
    } else {
      this.buscar = false
    }
  }

  async procesar(event, permitirDuplicados: boolean = false) {
    this.modalProcesoEjecucion();

    this.tarifasEspecialesService.procesarArchivoTarifasEspeciales({
      validacionArchivo: [
        {
          idArchivo: event.idArchivo,
          fechaArchivo: (([d, m, y]) => `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00.000+00:00`)(event.fechaArchivo.split('/')),
          estado: event.estado,
          fechaTransferencia: event.fechaTransferencia,
          url: event.url,
          nombreArchivo: event.nombreArchivo,
          idMaestroArchivo: event.idMaestroArchivo,
          nombreArchivoCompleto: event.nombreArchivoCompleto,
          usuarioSesion: atob(sessionStorage.getItem('user')),
          permitirReemplazoRegistros: permitirDuplicados
        }
      ]
    }).subscribe({
      next: (response: any) => {
        Swal.close();

        const nuevoEstado = response?.data?.content?.[0]?.estado;
        if (nuevoEstado) {
          event.estado = nuevoEstado;
          event.idArchivodb = response?.data?.content?.[0]?.idArchivodb;
        }

        Swal.fire({
          title: "Archivo procesado",
          text: "El archivo fue procesado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar"
        });
      },
      error: (err: any) => {
        let errorMsg = err?.error?.response?.description || "Ocurrió un error inesperado";

        if (err?.error?.response?.code === "E985") {
          let partes = errorMsg.split("|").map(p => p.trim()).filter(p => p.length > 0);
          let titulo = partes.shift();
          let lista = "<ul style='text-align:left'>";
          partes.forEach(p => {
            lista += `<li>${p}</li>`;
          });
          lista += "</ul>";

          errorMsg = `<p>${titulo}</p>${lista}<br><b>¿Desea reemplazar los registros duplicados?</b>`;
        }

        Swal.close();
        Swal.fire({
          title: "El archivo tiene registros duplicados",
          html: errorMsg,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          width: 700
        }).then((result) => {
          if (result.isConfirmed) {
            this.procesar(event, true);
          }
        });
      }
    });
  }


  eliminarArchivo(event) {
    Swal.fire({
      text: "¿Está seguro de eliminar el archivo " + event.nombreArchivoCompleto + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.tarifasEspecialesService.eliminarArchivoTarifasEspeciales({
          validacionArchivo: [
            {
              idArchivo: event.idArchivo,
              fechaArchivo: (([d, m, y]) => `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00.000+00:00`)(event.fechaArchivo.split('/')),
              estado: event.estado,
              fechaTransferencia: event.fechaTransferencia,
              url: event.url,
              nombreArchivo: event.nombreArchivo,
              idMaestroArchivo: event.idMaestroArchivo,
              nombreArchivoCompleto: event.nombreArchivoCompleto,
              usuarioSesion: atob(sessionStorage.getItem("user"))
            }
          ]
        }).subscribe({
          next: () => {
            Swal.fire({
              title: "Archivo eliminado",
              text: "El archivo fue eliminado exitosamente",
              icon: "success",
              confirmButtonText: "Aceptar"
            }).then((res) => {
              if (res.isConfirmed) {
                const data = this.dataSourceCargueTarifas.data;
                this.dataSourceCargueTarifas.data = data.filter(
                  (item: any) => item.idArchivo !== event.idArchivo
                );
                this.cantidadRegistros = this.dataSourceCargueTarifas.data.length;
              }
            });
          },
          error: (err: any) => {
            console.error("Error eliminando archivo:", err);
            let errorMsg =
              err?.error?.response?.description ||
              "Ocurrió un error al eliminar el archivo";
            Swal.fire({
              title: "Error al eliminar archivo",
              text: errorMsg,
              icon: "error",
              confirmButtonText: "Aceptar"
            });
          }
        });
      }
    });
  }

  verDetalleError(element) {
    console.log(element)
  }

  modalProcesoEjecucion() {
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

  verError(event) {
    this.cargueProgramacionPreliminarService.verDetalleArchivo({
      'idArchivoCargado': event.idArchivodb
    }).subscribe(data => {
      this.dialog.open(LogArchivosCargadosComponent, {
        width: "1000px",
        maxHeight: "90vh",
        data: {
          data: data
        }
      });
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description, codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3500);
      })
  }

  private convertirFecha(fecha: string): string {
    const [d, m, y] = fecha.split('/');

    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00.000+00:00`;
  }

}
