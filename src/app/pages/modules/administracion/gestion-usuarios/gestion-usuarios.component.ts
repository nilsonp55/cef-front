import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { CuentasPucService } from 'src/app/_service/contabilidad-service/cuentas-puc.service';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {

  form: FormGroup;
  dataSourceUsuarios: MatTableDataSource<any>
  displayedColumnsUsuarios: string[] = ['idUsuario','rol', 'estado', 'acciones'];
  mostrarFormulario = false;
  esEdicion: boolean;
  idUsuario: any;
  roles: any[] = [];

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private rolMenuService: RolMenuService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    await this.iniciarDesplegables();
    this.listarUsuarios();
    this.initForm();
  }

 /**
   * Inicializaion formulario de creacion y edicion
   * @BayronPerez
   */
  initForm(param?: any) { 
      this.form = new FormGroup({
        'idUsuario': new FormControl(param? param.idUsuario : null, Validators.email),
        'nombres': new FormControl(param? param.nombres : null),
        'apellidos': new FormControl(param? param.apellidos : null),
        'tipoUsario': new FormControl(param? param.tipoUsario : null),
        'rol': new FormControl(param? this.selectRol(param) : null),
        'estado': new FormControl(param? param.estado : null),

      });
  }

  selectRol(param: any): any {
    for (let i = 0; i < this.roles.length; i++) {
      const element = this.roles[i];
      if(element.idRol == param.rol.idRol) {
        return element;
      }
    }
  }

  /**
   * Lista los Usuarios
   * @BayronPerez
   */
  listarUsuarios() {
    this.rolMenuService.obtenerUsuarios().subscribe((page: any) => {
      this.dataSourceUsuarios = new MatTableDataSource(page.data);
      this.dataSourceUsuarios.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
    * Se realiza persistencia del formulario de usuarios
    * @BayronPerez
    */
   persistir() {
     /*
    let mailValido = false;
      'use strict';

      var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      let email = this.form.value['idUsuario']
      if (email.match(EMAIL_REGEX)){
        mailValido = true;
      }
     if(!mailValido){
      let lasa;
     } else {
       let loso;
     }
     */
    const usuarioDTO = {
      idUsuario: this.form.value['idUsuario'],
      nombres: this.form.value['nombres'],
      apellidos: this.form.value['apellidos'],
      tipoUsario: this.form.value['tipoUsario'],
      rol: {
        idRol: this.form.value['rol'].idRol
      },
      estado: this.form.value['estado'],
    };

    if (this.esEdicion) {
      usuarioDTO.idUsuario = this.idUsuario;
      this.rolMenuService.actualizarUsuario(usuarioDTO).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarUsuarios()
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
    } else {
      this.rolMenuService.guardarUsuario(usuarioDTO).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarUsuarios()
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

  /**
    * Se muestra el formulario para crear Usuario
    * @BayronPerez
    */
  crearUsuario() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
  }

  /**
    * Se muestra el formulario para actualizar usuario
    * @BayronPerez
    */
  actualizarUsuario(){
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.initForm(registro);
    this.mostrarFormulario = true;
    this.idUsuario = this.form.get('idUsuario').value;
    this.form.get('idUsuario').disable();
    this.esEdicion = true;
  }

  async iniciarDesplegables() {
    const _roles = await this.rolMenuService.obtenerRoles().toPromise();
    this.roles = _roles.data;
  }

}
