import { Component, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { CierreContabilidadService } from 'src/app/_service/contabilidad-service/cierre-contabilidad.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { DialogConfirmEjecutarComponentComponent } from '../../contabilizacion/dialog-confirm-ejecutar-component/dialog-confirm-ejecutar-component.component';
import { ResultadoContabilidadComponent } from '../../contabilizacion/resultado-contabilidad/resultado-contabilidad.component';

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
    private dialog: MatDialog,
    private rolMenuService: RolMenuService,
  ) { }

  ngOnInit(): void {
    this.user = sessionStorage.getItem(atob('user'));
    this.listarRoles();
  }

  /**
  * Se realiza consumo de servicio para listr los roles
  * @BaironPerez
  */
  listarRoles() {
    this.rolMenuService.obtenerRoles().subscribe(data => {
      this.listaRoles = data.data;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al cargar los roles',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 4000);
      })
  }


  /**
  * Se realiza consumo de servicio para listr los menus-rol
  * @BaironPerez
  */
  listarMenusRolUsuario() {
    this.rolMenuService.obtenerMenuRol({'rol.idRol': this.rolSelect.idRol })
      .subscribe((page: any) => {

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
        this.mostrarTablasRoles = true;
      },
        (err: ErrorService) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: 'Error al cargar la relación de roles con menus',
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          }); setTimeout(() => { alert.close() }, 5000);
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
    this.rolMenuService.actualizarMenuRol(menuRol).subscribe(data => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Se actualizó el registro correctamente',
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 2000);
      this.listarMenusRolUsuario();
    }, (err: ErrorService) => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Error al actualizar el registro',
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      }); setTimeout(() => { alert.close() }, 3000);
    });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
  }

}