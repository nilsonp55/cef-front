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
import { CrearRolComponent } from './crear-rol/crear-rol.component';

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
  @ViewChild('sortCarguePreliminar') sortCarguePreliminar: MatSort;
  @ViewChild('sortCertificacion') sortCertificacion: MatSort;
  @ViewChild('sortLiquidar') sortLiquidar: MatSort;
  @ViewChild('sortConciliacion') sortConciliacion: MatSort;
  @ViewChild('sortContabilidad') sortContabilidad: MatSort;
  @ViewChild('sortAdministracion') sortAdministracion: MatSort;
  @ViewChild('sortAdministracionContable') sortAdministracionContable: MatSort;

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
    private readonly rolMenuService: RolMenuService
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
    if(this.rolSelect === undefined){
      this.mostrarAlertaSeleccion();
      return
    }
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
          this.dataSourcePreliminar.sort = this.sortCarguePreliminar;
          this.dataSourcePreliminar.sortingDataAccessor = this.applyDataAccessor(this.dataSourcePreliminar);

          this.dataSourceCertificacion = new MatTableDataSource(listCertificacion);
          this.dataSourceCertificacion.sort = this.sortCertificacion;
          this.dataSourceCertificacion.sortingDataAccessor = this.applyDataAccessor(this.dataSourceCertificacion);

          this.dataSourceConciliacion = new MatTableDataSource(listConciliacion);
          this.dataSourceConciliacion.sort = this.sortConciliacion;
          this.dataSourceConciliacion.sortingDataAccessor = this.applyDataAccessor(this.dataSourceConciliacion);

          this.dataSourceContabilidad = new MatTableDataSource(listContabilidad);
          this.dataSourceContabilidad.sort = this.sortContabilidad;
          this.dataSourceContabilidad.sortingDataAccessor = this.applyDataAccessor(this.dataSourceContabilidad);

          this.dataSourceLiquidar = new MatTableDataSource(listLiquidacion);
          this.dataSourceLiquidar.sort = this.sortLiquidar;
          this.dataSourceLiquidar.sortingDataAccessor = this.applyDataAccessor(this.dataSourceLiquidar);

          this.dataSourceAdministracion = new MatTableDataSource(listAdministracion);
          this.dataSourceAdministracion.sort = this.sortAdministracion;
          this.dataSourceAdministracion.sortingDataAccessor = this.applyDataAccessor(this.dataSourceAdministracion);

          this.dataSourceAdministracionContable = new MatTableDataSource(listAdministracionContabilidad);
          this.dataSourceAdministracionContable.sort = this.sortAdministracionContable;
          this.dataSourceAdministracionContable.sortingDataAccessor = this.applyDataAccessor(this.dataSourceAdministracionContable);

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

  applyDataAccessor(dataSource: any) {
    dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      switch (sortHeaderId) {
        case 'nombreMenu':
          return data.menu.nombre;
        default:
          return data[sortHeaderId];
      }
    }
    return dataSource.sortingDataAccessor
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

  mostrarAlertaSeleccion() {
    const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: GENERALES.MESSAGE_ALERT.SEARCH_VALIDATION.EMPTY_FIELD_GENERAL,
        codigo: GENERALES.CODE_EMERGENT.WARNING
      }
    });
    setTimeout(() => { alert.close() }, 3000);
  }

  async abrirDialogRol(action: any) {
    const esEdicion = action === "edit";
    if(esEdicion && this.rolSelect === undefined){
      this.mostrarAlertaSeleccion();
      return
    }
    this.dialog.open(CrearRolComponent, {
      ...GENERALES.DIALOG_CONFIG,
      width: '450px',
      data: {
        flag: action,
        element: esEdicion ? this.rolSelect : null,
      },
      disableClose: true
    }).afterClosed()
      .subscribe((result) => {
        if (result?.data == undefined) {
          return
        }
        this.listarRoles();
        this.rolSelect = result?.data;
        this.listarMenusRolUsuario()
      });
  }

  compararRoles(rol1: any, rol2: any) {
    return rol1 && rol2 ? rol1.idRol === rol2.idRol : rol1 === rol2
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