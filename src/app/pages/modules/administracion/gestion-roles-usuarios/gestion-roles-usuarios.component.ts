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
  dataSourceMenuRol: MatTableDataSource<any>;
  displayedColumnsMenuRol: string[] = ['codigo', 'idRol', 'menuPadre', 'nombreMenu', 'estado', 'acciones'];

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
    this.rolMenuService.obtenerRoles().subscribe({ next: data => {
      this.listaRoles = data.data;
    },
    error: (err: ErrorService) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al cargar los roles',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })
  }


  /**
  * Se realiza consumo de servicio para listr los menus-rol
  * @BaironPerez
  */
  listarMenusRolUsuario() {
    this.rolMenuService.obtenerMenuRol({'rol.idRol': this.rolSelect.idRol })
      .subscribe({ next: (page: any) => {

        const consolidatedList: any[] = [];

        page.data.forEach(element => {
          this.validarEstado(element);
          consolidatedList.push(element);
        });

        this.dataSourceMenuRol = new MatTableDataSource(consolidatedList);
        this.dataSourceMenuRol.sort = this.sort;
        this.dataSourceMenuRol.paginator = this.paginator;

        //Mostramos la vista de tablas
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
    this.rolMenuService.actualizarMenuRol(menuRol).subscribe({ next: data => {
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

}