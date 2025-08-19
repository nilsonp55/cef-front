import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-rol',
  templateUrl: './crear-rol.component.html',
  styleUrls: ['./crear-rol.component.css'],
})
export class CrearRolComponent implements OnInit {
  spinnerActive: boolean = false;
  numericValue: string = "1";
  form: FormGroup;
  created: any;
  dataRol: any;
  previousId: string = '';

  constructor(
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CrearRolComponent>,
    private readonly rolMenuService: RolMenuService,
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken();
    this.dataRol = this.data.element
    this.initForm();
  }

  async initForm() {
    this.data.element
    this.form = new FormGroup({
      'nombre': new FormControl(this.dataRol ? this.dataRol.nombre : '', [Validators.required]),
      'idRol': new FormControl(this.dataRol ? this.dataRol.idRol : '', [Validators.required]),
      'descripcion': new FormControl(this.dataRol ? this.dataRol.descripcion : '', [Validators.required]),
      'estado': new FormControl(this.dataRol ? this.dataRol.estado === "1" : true, [Validators.required])
    });
  }

  persistir() {
    this.spinnerActive = true;

    this.numericValue = this.form.value.estado === true ? "1" : "2";
    const formValues = { ...this.form.value, estado: this.numericValue };
    debugger
    const esEdicion = this.data.flag === "edit";
    const serviceCall = esEdicion ?
      this.rolMenuService.actualizarRol(formValues, this.dataRol.idRol) :
      this.rolMenuService.guardarRol(formValues);

    serviceCall.subscribe({
      next: (page) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: esEdicion ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(page.response)
          },
        });
        setTimeout(() => { alert.close() }, 3500);
        this.created = page.data;
        this.dialogRef.close({ data: esEdicion? formValues : this.created });
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerActive = false;
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: esEdicion ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          },
        });

      }
    });
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.numericValue = target.checked ? "1" : "2";
  }

  onCancel(): void {
    this.dialogRef.close({ data: this.created })
  }
}
