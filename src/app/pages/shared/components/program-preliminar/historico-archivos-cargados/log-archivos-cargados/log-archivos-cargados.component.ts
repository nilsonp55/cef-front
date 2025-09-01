import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ValidacionArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-archivo.model';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';
import { VentanaEmergenteResponseComponent } from '../../../ventana-emergente-response/ventana-emergente-response.component';
import { DialogResultValidacionComponent } from '../../archivos-cargados/dialog-result-validacion/dialog-result-validacion.component';

@Component({
  selector: 'app-log-archivos-cargados',
  templateUrl: './log-archivos-cargados.component.html',
  styleUrls: ['./log-archivos-cargados.component.css']
})

/**
 * Componente para gestionar el log de cargue de la programación preliminar
 * @BaironPerez
*/
export class LogArchivosCargadosComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { 
    this.data;
  }


  validarError() {
    this.cargueProgramacionPreliminarService.verDetalleArchivo({
      'idArchivoCargado': this.data.id
    }).subscribe((data: ValidacionArchivo) => {
      this.dialog.open(DialogResultValidacionComponent, {
        height:'auto%', width: '950px', maxHeight: '90%', data: { idData: this.data.id, data }
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

}
