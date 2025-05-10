import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ValidacionArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-archivo.model';
import { CargueProgramacionDefinitivaService } from 'src/app/_service/programacion-definitiva-service/programacion-definitiva-service';
import { DialogVerArchDefiComponent } from '../dialog-ver-arch-defi/dialog-ver-arch-defi.component';

@Component({
  selector: 'app-log-archivo-cargado-definitivo',
  templateUrl: './log-archivo-cargado.component.html',
  styleUrls: ['./log-archivo-cargado.component.css']
})

/**
 * Componente para gestionar el log de cargue de la programación preliminar
 * @BaironPerez
*/
export class LogArchivoCargadoDefinitivoComponent implements OnInit {

  idDatas: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cargueProgramacionDefinitivaService: CargueProgramacionDefinitivaService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.idDatas = this.data.idModArch;
  }

  validarErrores() {
    this.cargueProgramacionDefinitivaService.verDetalleArchivo({
      'idArchivoCargado': this.data.id
    }).subscribe({next: (data: ValidacionArchivo) => {
        this.dialog.open(DialogVerArchDefiComponent, {//
          height:'70%', width: '950px', data: {idModArch: this.idDatas, idData: this.data.id, data},//

        });
    },
    error: (err: any) => {
      this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: err.error.response.description, codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      });
    }})
  }

}
