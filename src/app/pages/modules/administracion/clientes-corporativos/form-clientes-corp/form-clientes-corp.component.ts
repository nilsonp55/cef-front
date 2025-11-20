import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-form-clientes-corp',
  templateUrl: './form-clientes-corp.component.html',
  styleUrls: ['./form-clientes-corp.component.css'],
})
export class FormClientesCorpComponent implements OnInit {
  form: FormGroup;
  bancos: any[] = [];
  tiposIdentificacion: any = GENERALES.TIPO_IDENTIFICACION;
  spinnerActive: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormClientesCorpComponent>,
    private readonly clientesCorporativosServices: ClientesCorporativosService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
    this.initForm(this.data);
  }

  initForm(param?: any) {
    if (!(param === null || param === undefined)) {
      this.bancos = param.bancos;
      let banco =
        param.row?.codigoBancoAval != null
          ? this.bancos.find(
            (value) => value.codigoPunto == param.row.codigoBancoAval
          )
          : [];
      this.form = new FormGroup({
        codigoCliente: new FormControl({
          value: param.row?.codigoCliente,
          disabled: true,
        }),
        codigoBancoAval: new FormControl(param.row != null ? banco : null),
        nombreCliente: new FormControl(
          param.row != null ? param.row.nombreCliente : null,
          [Validators.required, Validators.nullValidator]
        ),
        tipoId: new FormControl(param.row != null ? param.row.tipoId : null),
        identificacion: new FormControl(
          param.row != null ? param.row.identificacion : null
        ),
        tarifaSeparacion: new FormControl(
          param.row != null ? param.row.tarifaSeparacion : null
        ),
        amparado: new FormControl(
          param.row != null ? param.row.amparado : false
        ),
        aplicaTarifaEspecial: new FormControl(
          param.row != null ? param.row.aplicaTarifaEspecial : false
        ),
      });
      if (!this.form.get('amparado')?.value) {
        this.form.get('aplicaTarifaEspecial')?.disable();
      }
      
      this.form.get('amparado')?.valueChanges.subscribe((value) => {
        if (!value) {
          this.form.get('aplicaTarifaEspecial')?.disable();
          this.form.get('aplicaTarifaEspecial')?.setValue(false); // opcional
        } else {
          this.form.get('aplicaTarifaEspecial')?.enable();
        }
      });
    }
  }

  async saveClienteCorporativo() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.spinnerActive = true;
    const rowSave = {
      codigoCliente: this.form.controls['codigoCliente'].value,
      codigoBancoAval: this.form.controls['codigoBancoAval'].value.codigoPunto,
      identificacion: this.form.controls['identificacion'].value,
      nombreCliente: this.form.controls['nombreCliente'].value,
      tipoId: this.form.controls['tipoId'].value,
      tarifaSeparacion: this.form.controls['tarifaSeparacion'].value,
      amparado: this.form.controls['amparado'].value,
      aplicaTarifaEspecial: this.form.controls['aplicaTarifaEspecial'].value
    };

    const serviceCall = this.data.flag === 'create'
      ? this.clientesCorporativosServices.guardarClientesCorporativos(rowSave)
      : this.clientesCorporativosServices.actualizarClientesCorporativos(rowSave);

    serviceCall.subscribe({
      next: (page: any) => {
        this.dialog
          .open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: this.data.flag === 'create' ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE
                : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
              showResume: true,
              msgDetalles: JSON.stringify(page.response)
            },
          })
          .afterClosed()
          .subscribe((result) => {
            this.dialogRef.close(rowSave);
          });
        this.spinnerActive = false;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: this.data.flag === 'create' ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE
              : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error.response)
          },
        });
        this.spinnerActive = false;
      },
    });

  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
