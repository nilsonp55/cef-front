
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { Component, Inject } from '@angular/core';
import { saveAs } from 'file-saver';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import Swal from 'sweetalert2';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';


// Componente modal visualizacion y descarga archivo
@Component({
    selector: 'app-ventana-emergente-detalle-gestion',
    templateUrl: 'ventana-emergente-detalle-gestion.component.html',
})
export class VentanaEmergenteDetalleGestionComponent {

    dataNoPendiente: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private cargueArchivosService: CargueArchivosService, private opConciliacionCostosService: OpConciliacionCostosService) { }

    ngOnInit() {
        if (this.data.msn.estado !== "PENDIENTE") {
            this.modalProcesoEjecucion();
            this.opConciliacionCostosService.obtenerArchivoDetalleProcesar({
                idArchivoCargado: this.data.msn.idArchivodb
            }).subscribe({
                next: (response: any) => {
                    if (response.data !== undefined) {
                        response.data.forEach(element => {
                            this.dataNoPendiente.push(element.contenido)
                        });
                    }
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
        } else {
            this.consultarContenArchivo();
        }
    }


    descargarArchivo() {
        if (this.data.msn.estado === "PENDIENTE") {
            this.cargueArchivosService.visializarArchivo3({
                'nombreArchivo': this.data.msn.nombreArchivoCompleto,
                'idMaestroArchivo': this.data.msn.idMaestroArchivo,
            }).subscribe(blob => {
                blob.saveFile();
            });
        } else {
            this.opConciliacionCostosService.obtenerArchivoDetalleProcesar({
                idArchivoCargado: this.data.msn.idArchivodb
            }).subscribe({
                next: (response: any) => {
                    let listaContenido: any = []
                    if (response.data !== undefined) {
                        response.data.forEach(element => {
                            listaContenido.push(element.contenido)
                        });
                    }
                    const contenidoTexto = listaContenido.join('')
                    const blob = new Blob([contenidoTexto], { type: 'text/plain' });
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

    consultarContenArchivo() {
        this.modalProcesoEjecucion();
        this.opConciliacionCostosService.obtenerListaArchivoPendienteCarga({
            star: 0, end: 0, content: true, fileName: this.data.msn.nombreArchivo
        }).subscribe({
            next: (page: any) => {
                this.data.msn.contenidoArchivo = page.data.content[0].contenidoArchivo
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
