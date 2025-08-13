import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { ErrorService } from 'src/app/_model/error.model';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-roles-usuarios',
  templateUrl: './gestion-roles-usuarios.component.html',
  styleUrls: ['./gestion-roles-usuarios.component.css']
})

/**
 * Componente para gestionar el menu de menus segun roles
 * @BaironPerez
*/
export class GestionRolesUsuariosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  listaRoles: any;
  rolSelect: any;
  mostrarTablasRoles: boolean = false;
  user: any;
  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourcePreliminar: MatTableDataSource<any>;
  displayedColumnsPreliminar: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

  dataSourceCertificacion: MatTableDataSource<any>;
  displayedColumnsCertificacion: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

  dataSourceLiquidar: MatTableDataSource<any>;
  displayedColumnsLiquidar: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

  dataSourceConciliacion: MatTableDataSource<any>;
  displayedColumnsConciliacion: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

  dataSourceContabilidad: MatTableDataSource<any>;
  displayedColumnsContabilidad: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

  dataSourceAdministracion: MatTableDataSource<any>;
  displayedColumnsAdministracion: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

  dataSourceAdministracionContable: MatTableDataSource<any>;
  displayedColumnsAdministracionContable: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly rolMenuService: RolMenuService,
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.user = atob(sessionStorage.getItem('user'));
    this.listarRoles();
  }

  /**
  * Se realiza consumo de servicio para listr los roles
  * @BaironPerez
  */
  listarRoles() {
    this.spinnerActive = true;
    this.rolMenuService.obtenerRoles().subscribe({
      next: data => {
        this.listaRoles = data.data;
        this.spinnerActive = false;
      },
      error: (err: ErrorService) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al cargar los roles',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        this.spinnerActive = false;
      }
    })
  }


  /**
  * Se realiza consumo de servicio para listr los menus-rol
  * @BaironPerez
  */
  listarMenusRolUsuario() {
    this.spinnerActive = true;
    this.rolMenuService.obtenerMenuRol({ 'rol.idRol': this.rolSelect.idRol })
      .subscribe({
        next: (page: any) => {

          const listPreliminar: any[] = [];
          const listCertificacion: any[] = [];
          const listConciliacion: any[] = [];
          const listContabilidad: any[] = [];
          const listLiquidacion: any[] = [];
          const listAdministracion: any[] = [];
          const listAdministracionContabilidad: any[] = [];


          page.data.forEach(element => {
            if (element.menu.idMenuPadre == "carguePreliminar") {
              this.validarEstado(element);
              listPreliminar.push(element);
            }
            if (element.menu.idMenuPadre == "cargueCertificacion") {
              this.validarEstado(element);
              listCertificacion.push(element);
            }
            if (element.menu.idMenuPadre == "conciliacion") {
              this.validarEstado(element);
              listConciliacion.push(element);
            }
            if (element.menu.idMenuPadre == "contabilidad") {
              this.validarEstado(element);
              listContabilidad.push(element);
            }
            if (element.menu.idMenuPadre == "liquidacion") {
              this.validarEstado(element);
              listLiquidacion.push(element);
            }
            if (element.menu.idMenuPadre == "administracion") {
              this.validarEstado(element);
              listAdministracion.push(element);
            }
            if (element.menu.idMenuPadre == "administracionTabContables") {
              this.validarEstado(element);
              listAdministracionContabilidad.push(element);
            }
          });

          this.dataSourcePreliminar = new MatTableDataSource(listPreliminar);
          this.dataSourcePreliminar.sort = this.sort;

          this.dataSourceCertificacion = new MatTableDataSource(listCertificacion);
          this.dataSourceCertificacion.sort = this.sort;

          this.dataSourceConciliacion = new MatTableDataSource(listConciliacion);
          this.dataSourceConciliacion.sort = this.sort;

          this.dataSourceContabilidad = new MatTableDataSource(listContabilidad);
          this.dataSourceContabilidad.sort = this.sort;

          this.dataSourceLiquidar = new MatTableDataSource(listLiquidacion);
          this.dataSourceLiquidar.sort = this.sort;

          this.dataSourceAdministracion = new MatTableDataSource(listAdministracion);
          this.dataSourceAdministracion.sort = this.sort;

          this.dataSourceAdministracionContable = new MatTableDataSource(listAdministracionContabilidad);
          this.dataSourceAdministracionContable.sort = this.sort;

          //Mostramos la vista de tablas
          this.spinnerActive = false;
          this.mostrarTablasRoles = true;
        },
        error: (err: ErrorService) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: 'Error al cargar la relación de roles con menus',
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          this.spinnerActive = false;
        }
      });
  }

  /**
  * Metodo para formater el estado por el que esta el menu-rol
  * @BaironPerez
  */
  validarEstado(element): any {
    if (element.estado == "1") {
      element._estado = "Activo"
      return element;
    }
    if (element.estado == "2") {
      element._estado = "Inactivo"
      return element;
    }
  }

  /**
  * Metodo para gestionar la actualizacion de estado del manu para el rol
  * @BaironPerez
  */
  accion(element: any, accion: any) {
    if (accion == "activar") {
      element.estado = "2";
      this.persistirActualizar(element)
    }
    if (accion == "desactivar") {
      element.estado = "1";
      this.persistirActualizar(element)
    }
  }

  persistirActualizar(element: any) {
    const rol = { idRol: element.idRol }
    const menuRol = {
      codigo: element.codigo,
      rol: rol,
      menu: element.menu,
      estado: element.estado,
      fechaCreacion: new Date(),
      usuarioCreacion: "baironperez12",
      fechaModificacion: new Date(),
      usuarioModificacion: "baironperez12"
    }
    this.modalProcesoEjecucion()
    this.rolMenuService.actualizarMenuRol(menuRol).subscribe({
      next: data => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Se actualizó el registro correctamente',
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarMenusRolUsuario();
      },
      error: (err: ErrorService) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al actualizar el registro',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    });
  }

  modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    });
  }
}