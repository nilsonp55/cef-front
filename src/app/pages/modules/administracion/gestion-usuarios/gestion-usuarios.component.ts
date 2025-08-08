import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {

  form: FormGroup;
  dataSourceUsuarios: MatTableDataSource<any>
  displayedColumnsUsuarios: string[] = ['idUsuario', 'nombres', 'apellidos', 'tipoUsuario' ,'rol', 'estado', 'acciones'];
  mostrarFormulario = false;
  mostrarTabla = true;
  esEdicion: boolean;
  idUsuario: any;
  roles: any[] = [];

  spinnerActive: boolean = false;

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private readonly rolMenuService: RolMenuService,
    private readonly dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.visualizarTabla()
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken()
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
      'idUsuario': new FormControl(param? param.idUsuario : null, [Validators.email, Validators.required]),
      'nombres': new FormControl(param? param.nombres : null, [Validators.required]),
      'apellidos': new FormControl(param? param.apellidos : null, [Validators.required]),
      'tipoUsuario': new FormControl(param? param.tipoUsuario : null, [Validators.required]),
      'rol': new FormControl(param? this.selectRol(param) : null, [Validators.required]),
      'estado': new FormControl(param?.estado === "1"),
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
      this.spinnerActive = false;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.spinnerActive = false;
      });
  }

  /**
    * Se realiza persistencia del formulario de usuarios
    * @BayronPerez
    */
   persistir() {
    let valorEstado = '0';
    if(this.form.value['estado']){
     valorEstado = '1';
    }
    const usuarioDTO = {
      idUsuario: this.form.value['idUsuario'],
      nombres: this.form.value['nombres'],
      apellidos: this.form.value['apellidos'],
      tipoUsuario: this.form.value['tipoUsuario'],
      rol: {
        idRol: this.form.value['rol'].idRol
      },
      estado: valorEstado,
    };

    if (this.esEdicion) {
      usuarioDTO.idUsuario = this.idUsuario;
      this.rolMenuService.actualizarUsuario(usuarioDTO).subscribe({next : response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(response)
          }
        });
        this.listarUsuarios()
        this.initForm();
        this.visualizarTabla()
      },
      error:  (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err.response)
            }
          });
          this.visualizarTabla()
        }});
    } else {
      this.rolMenuService.guardarUsuario(usuarioDTO).subscribe({next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(response.response)
          }
        }); 
        this.listarUsuarios()
        this.initForm();
        this.visualizarTabla()
      },
      error:  (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err.response)
            }
          });
          this.visualizarTabla()
        }});
    }
   }

  /**
    * Se muestra el formulario para crear Usuario
    * @BayronPerez
    */
  crearUsuario() {
    this.visualizarFormulario()
    this.esEdicion = false;
  }

  visualizarTabla(){
    this.mostrarFormulario = false;
    this.mostrarTabla = true;
  }

  visualizarFormulario(){
    this.mostrarFormulario = true;
    this.mostrarTabla = false;
  }

  editar(registro: any) {
    this.visualizarFormulario()
    this.initForm(registro);
    this.idUsuario = this.form.get('idUsuario').value;
    this.form.get('idUsuario').disable();
    this.esEdicion = true;
  }

  async iniciarDesplegables() {
    const _roles = await this.rolMenuService.obtenerRoles().toPromise();
    this.roles = _roles.data;
  }

   irAtras() {
    this.mostrarFormulario = false;
    this.ngOnInit()
  }
}
