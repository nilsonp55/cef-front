import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { FestivosNacionalesService } from 'src/app/_service/administracion-service/festivos-nacionales.service';

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

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private festivosNacionalesService: FestivosNacionalesService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.listarFestivosNacionales();
    this.initForm();
  }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'fecha': new FormControl(param ? param.fecha : null),
      'descripcion': new FormControl(param ? param.descripcion : null),
    });
  }

  /**
   * Lista los Usuarios
   * @BayronPerez
   */
  listarFestivosNacionales() {
    this.festivosNacionalesService.obtenerFestivosNaciones().subscribe((page: any) => {
      this.dataSourceUsuarios = new MatTableDataSource(page.data);
      this.dataSourceUsuarios.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "Error al listar los Festivos Nacionales",
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
    * Se muestra el formulario para crear Usuario
    * @BayronPerez
    */
   crearUsuario() {
    this.mostrarFormulario = true;
  }
  
  /**
    * Se realiza persistencia del formulario de usuarios
    * @BayronPerez
    */
  persistir() {
    const festivosNacionales = {
      fecha: this.form.value['fecha'],
      descripcion: this.form.value['descripcion'],
    };

    this.festivosNacionalesService.guardarFestivosNacionales(festivosNacionales).subscribe(response => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
      this.listarFestivosNacionales()
      this.initForm();
      this.mostrarFormulario = false;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
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
    const para = {
      fecha: param.fecha,
      descripcion: param.descripcion
  }
    this.festivosNacionalesService.eliminarFestivosNacionales(para).subscribe(response => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_DELETE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
      this.listarFestivosNacionales()
      this.initForm();
      this.mostrarFormulario = false;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

}
