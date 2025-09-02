import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DominioFuncionalService } from 'src/app/_service/administracion-service/dominio-funcional.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-dialog-identificador-dominio',
  templateUrl: './dialog-identificador-dominio.component.html',
  styleUrls: ['./dialog-identificador-dominio.component.css'],
})
export class DialogIdentificadorDominioComponent implements OnInit {
  form: FormGroup;
  estado: string;
  esEdicion: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dominioService: DominioFuncionalService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
    this.esEdicion = this.data.flag === 'edit';
    this.initForm(this.data.row);
  }

  initForm(param?: any) {
    this.form = new FormGroup({
      dominio: new FormControl(param ? param.id.dominio : null),
      codigo: new FormControl(param ? param.id.codigo : null),
      descripcion: new FormControl(param ? param.descripcion : null),
      tipo: new FormControl(param ? param.tipo : null),
      valorTexto: new FormControl(param ? param.valorTexto : null),
      valorNumero: new FormControl(param ? param.valorNumero : null),
      valorFecha: new FormControl(param ? param.valorFecha : null),
      estado: new FormControl(param?.estado == '1'),
    });
    this.form.controls['dominio'].disable();
    this.form.controls['tipo'].disable();
    if (this.esEdicion) {
      this.form.controls['codigo'].disable();
    }
  }

  persistir() {
    const dominioFuncional = {
      id: {
        dominio:
          this.form.value['dominio'] ?? this.form.controls['dominio'].value,
        codigo: this.form.value['codigo'] ?? this.form.controls['codigo'].value,
      },
      descripcion: this.form.value['descripcion'],
      tipo: this.form.value['tipo'] ?? this.form.controls['tipo'].value,
      valorTexto: this.form.value['valorTexto'],
      valorNumero: this.form.value['valorNumero'],
      valorFecha: this.form.value['valorFecha'],
      estado: this.form.value['estado'] ? '1' : '0',
    }; 

    const serviceCall = this.esEdicion
      ? this.dominioService.actualizarDominioFuncional(dominioFuncional)
      : this.dominioService.guardarDominioFuncional(dominioFuncional);

    serviceCall.subscribe({
      next: (response) => {
        const dialogref = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: this.esEdicion
              ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE
              : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(response?.response),
          },
        });
        dialogref.afterClosed().subscribe((result) => {
          this.dialog.closeAll();
        });
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: this.esEdicion
              ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE
              : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error),
          },
        });
      },
    });
  }
}
