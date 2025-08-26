import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorService } from 'src/app/_model/error.model';
import { FestivosNacionalesService } from 'src/app/_service/administracion-service/festivos-nacionales.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';


@Component({
  selector: 'app-administracion-festivos-nacionales',
  templateUrl: './administracion-festivos-nacionales.component.html',
  styleUrls: ['./administracion-festivos-nacionales.component.css']
})
export class AdministracionFestivosNacionalesComponent implements OnInit {

  form: FormGroup;
  dataSourceUsuarios: MatTableDataSource<any>
  displayedColumnsUsuarios: string[] = ['fecha', 'descripcion', 'acciones'];
  mostrarFormulario = false;
  esEdicion: boolean;
  idFecha: any;
  roles: any[] = [];
  spinnerActive: boolean = false;
  mostrarTabla: boolean = true;

  //Registros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private readonly festivosNacionalesService: FestivosNacionalesService,
    private readonly dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    this.listarFestivosNacionales();
    this.initForm();
  }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'fecha': new FormControl(param ? param.fecha : null, [Validators.required]),
      'descripcion': new FormControl(param ? param.descripcion : null, [Validators.required]),
    });
  }

  /**
   * Lista los Usuarios
   * @BayronPerez
   */
  listarFestivosNacionales() {
    this.spinnerActive = true;
    this.festivosNacionalesService.obtenerFestivosNaciones().subscribe({
      next: (page: any) => {
        this.dataSourceUsuarios = new MatTableDataSource(page.data);
        this.dataSourceUsuarios.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.spinnerActive = false;
        this.visualizarTabla()
      },
      error: (err: ErrorService) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "Error al listar los Festivos Nacionales",
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        this.spinnerActive = false;
        this.visualizarTabla()
      }
    });
  }

  visualizarTabla() {
    this.mostrarTabla = true;
    this.mostrarFormulario = false;
  }

  visualizarFormulario() {
    this.mostrarTabla = false;
    this.mostrarFormulario = true
  }

  /**
    * Se muestra el formulario para crear Usuario
    * @BayronPerez
    */
  crearFestivo() {
    this.visualizarFormulario()
  }

  /**
    * Se realiza persistencia del formulario de usuarios
    * @BayronPerez
    */
  persistir() {
    this.spinnerActive = true;
    const festivosNacionales = {
      fecha: this.form.value['fecha'],
      descripcion: this.form.value['descripcion'],
    };

    this.festivosNacionalesService.guardarFestivosNacionales(festivosNacionales).subscribe({
      next: (page: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE + page?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarFestivosNacionales()
        this.initForm();
        this.visualizarTabla()
        this.spinnerActive = false;
      },
      error: (err: HttpErrorResponse) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.mensaje,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        this.spinnerActive = false;
      }
    });

  }

  /**
    * Se muestra el formulario para crear Usuario
    * @BayronPerez
    */
  crearFestivosNacional() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
  }

  eliminar(param: any) {
    this.spinnerActive = true;
    this.festivosNacionalesService.eliminarFestivosNacionales({ 'idFecha': param.fecha }).subscribe({
      next: (page: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_DELETE + page?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarFestivosNacionales()
        this.initForm();
        this.mostrarFormulario = false;
        this.spinnerActive = false;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DELETE + err.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        this.spinnerActive = false;
      }
    });
  }

  onCancel() {
    this.form.reset()
    this.visualizarTabla()
  }
}
