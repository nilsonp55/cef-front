import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VentanaEmergenteEliminarComponent } from '../../archivos-pendientes-carga/ventana-emergente-eliminar/ventana-emergente-eliminar.component';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import Swal from 'sweetalert2';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';

@Component({
  selector: 'app-ventana-emergente-procesamiento',
  templateUrl: './ventana-emergente-procesamiento.component.html',
  styleUrls: ['./ventana-emergente-procesamiento.component.css']
})
export class VentanaEmergenteProcesamientoComponent implements OnInit {
  observacion: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<VentanaEmergenteEliminarComponent>,
    private opConciliacionCostosService: OpConciliacionCostosService) { }

  ngOnInit(): void { }

  procesar() {
    if(this.observacion.toString().trim().length == 0){
      Swal.fire({
        title: "Se requiere ingresar observaciones",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
      });
      return;
    }

    let listaEstructura: any = [];
    let operacion: string = this.data.event.split('_')[1].toLowerCase();
    let params = {
      registroOperacion: listaEstructura,
      operacion: operacion,
      observacion: this.observacion
    };
    let registrosNoProcesados : boolean = false, mensajeProcesados: string = '',  accion: string ='';

    if (this.data.event == 'conciliadas_desconciliar'){
      this.data.msn.forEach(element => {
        if(element.estado == "AUTOMATICO")
          registrosNoProcesados = true;
        listaEstructura.push({
          "idRegistro": element.consecutivo_registro,
          "operacionEstado": operacion,
          "observacion": this.observacion
         });
      });
      this.opConciliacionCostosService.desconciliarConciliadasProcesamiento(params)
      .subscribe({
        next: (response: any) => {
          if (response.response.description === "Success"){
            mensajeProcesados = !registrosNoProcesados ? "Registro(s) desconciliados correctamente" : "Registro(s) desconciliados correctamente \n\n Los registros seleccionados en estado de conciliación automático no han sido procesados";
            this.procesoExitoso(response, mensajeProcesados);
          }
        }, error: (err: any) => {
          this.processoErrado(err);
        }
      });
    } else if (this.data.event == 'cobradas_aceptar' || this.data.event == 'cobradas_rechazar'){
      this.data.msn.forEach(element => {
        listaEstructura.push({
          "idRegistro": element.consecutivo_registro,
          "operacionEstado": operacion,
          "observacion": this.observacion
         });
      });
      this.opConciliacionCostosService.aceptarRechazarCobradasTDVNoIdentificadasProcesamiento(params)
      .subscribe({
        next: (response: any) => {
          if (response.response.description === "Success") {
            accion = this.data.event == "cobradas_aceptar" ? "aceptados" : "rechazados";
            registrosNoProcesados = response.data.some(reg => reg.operacionEstado == "NO PUDO REALIZAR LA OPERACION");
            mensajeProcesados = !registrosNoProcesados ? "Registro(s) " + accion + " correctamente" : "Registro(s) " + accion + " correctamente \n\n La operación solicitada no pudo completarse con algunos registros."
            this.procesoExitoso(response, mensajeProcesados);
          }
        }, error: (err: any) => {
          this.processoErrado(err);
        }
      });
    } else if (this.data.event == "liquidadas_eliminar" || this.data.event == "liquidadas_rechazar"){
      this.data.msn.forEach(element => {
        listaEstructura.push({
          "idRegistro": element.id_liquidacion,
          "operacionEstado": operacion,
          "observacion": this.observacion
         });
      });
      this.opConciliacionCostosService.eliminarRechazarLiquidadasNoCobradasTDVProcesamiento(params)
      .subscribe({
        next: (response: any) => {
          if (response.response.description === "Success") {
            accion = this.data.event == "liquidadas_eliminar" ? "eliminados" : "rechazados";
            registrosNoProcesados = response.data.some(reg => reg.operacionEstado == "NO PUDO REALIZAR LA OPERACION");
            mensajeProcesados = !registrosNoProcesados ? "Registro(s) " + accion + " correctamente" : "Registro(s) " + accion + " correctamente \n\n La operación solicitada no pudo completarse con algunos registros."
            this.procesoExitoso(response, mensajeProcesados);
          }
        }, error: (err: any) => {
          this.processoErrado(err);
        }
      });
    } else if(this.data.event == "identificadas_aceptar" || this.data.event == "identificadas_rechazar"){
      this.data.msn.forEach(element => {
        listaEstructura.push({
          "idRegistro": element.consecutivo_registro,
          "operacionEstado": operacion,
          "observacion": this.observacion,
          "idLiquidacion": element.id_liquidacion
         });
      });
      this.opConciliacionCostosService.aceptarRechazarIdentificadasConDiferenciasProcesamiento(params)
      .subscribe({
        next: (response: any) => {
          if (response.response.description === "Success") {
            accion = this.data.event == "identificadas_aceptar" ? "aceptados" : "rechazados";
            registrosNoProcesados = response.data.some(reg => reg.operacionEstado == "NO PUDO REALIZAR LA OPERACION");
            mensajeProcesados = !registrosNoProcesados ? "Registro(s) " + accion + " correctamente" : "Registro(s) " + accion + " correctamente \n\n La operación solicitada no pudo completarse con algunos registros."
            this.procesoExitoso(response, mensajeProcesados);
          }
        }, error: (err: any) => {
          this.processoErrado(err);
        }
      });
    } else if(this.data.event == "eliminados_reintegrar_registros"){
      this.data.msn.forEach(element => {
        listaEstructura.push({
          "idRegistro": element.id_liquidacion,
          "operacionEstado": operacion,
          "observacion": this.observacion
         });
      });
      this.opConciliacionCostosService.reintegrarRegistrosEliminadosProcesamiento(params)
      .subscribe({
        next: (response: any) => {
          if (response.response.description === "Success") {
            accion = "reintegrados";
            registrosNoProcesados = response.data.some(reg => reg.operacionEstado == "NO PUDO REALIZAR LA OPERACION");
            mensajeProcesados = !registrosNoProcesados ? "Registro(s) " + accion + " correctamente" : "Registro(s) " + accion + " correctamente \n\n La operación solicitada no pudo completarse con algunos registros."
            this.procesoExitoso(response, mensajeProcesados);
          }
        }, error: (err: any) => {
          this.processoErrado(err);
        }
      });
    }
  }

  procesoExitoso(response:any, message:string){
      Swal.fire({
        title: message,
        imageUrl: "assets/img/succesfull.png",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
        this.dialogRef.close(response.data);
      });
  }

  processoErrado(err:any){
    const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: err.error.response.description,
        codigo: GENERALES.CODE_EMERGENT.ERROR
      }
    });
    setTimeout(() => { alert.close() }, 3000);
    Swal.close();
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

  closeModal() {
    this.dialogRef.close("cancelar");
  }
}
