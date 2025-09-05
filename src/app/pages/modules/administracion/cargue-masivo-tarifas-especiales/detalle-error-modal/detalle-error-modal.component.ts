import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TarifasEspecialesService } from 'src/app/_service/liquidacion-service/tarifas-especiales.service';
import { TarifasOperacionService } from 'src/app/_service/liquidacion-service/tarifas-operacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-error-modal',
  templateUrl: './detalle-error-modal.component.html',
  styleUrls: ['./detalle-error-modal.component.css']
})
export class DetalleErrorModalComponent implements OnInit {

  datosArchivo: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private tarifasEspecialesService: TarifasEspecialesService) { }

  ngOnInit(): void {
    console.log(this.data)
    this.consultarDetalleArchivo();
  }

  consultarDetalleArchivo() {
    this.tarifasEspecialesService.consultarDetalleArchivoTarifasEspeciales({
      "validacionArchivo": [
        {
          "idArchivo": this.data?.element?.idArchivo,
          "estado": this.data?.element?.estado,
          "fechaTransferencia": this.data?.element?.fechaTransferencia,
          "fechaArchivo": this.data?.element?.fechaArchivo,
          "tipoArchivo": "TARIFA_ESPECIAL_CLIENTE",
          "nombreArchivo": this.data?.element?.nombreArchivo,
          "idMaestroArchivo": this.data?.element?.idMaestroArchivo,
          "nombreArchivoCompleto": this.data?.element?.nombreArchivoCompleto,
          "usuarioSesion": atob(sessionStorage.getItem('user') || ""),
          "permitirReemplazoRegistros": false,
          "url": this.data?.element?.url
        }
      ]
    }).subscribe({
      next: (response: any) => {
        const contenido = response?.data?.content?.[0]?.contenidoArchivo;
        if (contenido && contenido.length > 0) {
          this.datosArchivo = contenido;
        } else {
          this.datosArchivo = [];
        }
      },
      error: (err: any) => {
        this.datosArchivo = [];
      }
    });
  }


  descargarArchivoCSV() {
    if (!this.datosArchivo || this.datosArchivo.length === 0) {
      Swal.fire({
        title: "Sin datos",
        text: "No hay información disponible para descargar.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
      return;
    }
    const csvContent = this.datosArchivo.filter((line: string) => line && line.trim() !== "").join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", this.data?.element?.nombreArchivo + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }


}
