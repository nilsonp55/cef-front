import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { DialogTablaDominioComponent } from './dialog-tabla-dominio/dialog-tabla-dominio.component';
import { DialogIdentificadorDominioComponent } from './dialog-identificador-dominio/dialog-identificador-dominio.component';
import { DialogEliminarIdentificadorComponent } from './dialog-eliminar-identificador/dialog-eliminar-identificador.component';
import { DominioMaestroService } from 'src/app/_service/administracion-service/dominios-maestro.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-administracion-dominios',
  templateUrl: './administracion-dominios.component.html',
  styleUrls: ['./administracion-dominios.component.css']
})
export class AdministracionDominiosComponent implements OnInit {

  btnEstado = true;
  isIdentChecked = true;
  isDominioChecked = true;
  btnActualizar = false;
  mostrarTablaCodigos = false;
  mostrarBtnDescripcionCodigo = false;
  mostrarBtnEliminarCodigo = false;
  elementoDominioActualizar: any;
  elementoCodigo: any;
  valorEstado: any;
  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number;

  displayedColumns: string[] = ['name'];
  clickedRows = new Set<any>();

  displayedColumnsIdent: string[] = ['identificador', 'descripcion'];

  constructor(
    private dominioMaestroService: DominioMaestroService,
    private generalesService: GeneralesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
    this.listarDominios();

  }

  dataSourceCodigos: MatTableDataSource<any>;

  dataSourceDominios: MatTableDataSource<any>;
  displayedColumnsDominios: string[] = ['name'];

  define() {
    this.listarDominios();
  }


  defineCodigo(){
    this.listarCodigosDominio()
  }

  interpretaCheckBox(){
    if(this.isIdentChecked==true){
      this.valorEstado = "1"
    }
    if(this.isIdentChecked==false){
      this.valorEstado = ""
    }
    return this.valorEstado
  }

  listarCodigosDominio() {
    this.generalesService.listarDominioXDominio({
      'dominioPK.dominio': this.elementoDominioActualizar.dominio,
      'estado': this.interpretaCheckBox()
    }).subscribe({
      next: (page: any) => {
        this.dataSourceCodigos = new MatTableDataSource(page.data);
        this.dataSourceCodigos.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE + " - " + err.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })
  }

  /**
   * Lista los dominios en estado true (Activos)
   * @JuanMazo
   */
  listarDominiosMaestroTrue() {
    this.dominioMaestroService.listarDominiosTrue({
      'estado': true
    }).subscribe({
      next: (page: any) => {
        this.dataSourceDominios = new MatTableDataSource(page.data);
        this.dataSourceDominios.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE + " - " + err.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    });
  }

  listarDominios() {
    if (this.isDominioChecked == true) {
      this.listarDominiosMaestroTrue()
    } else {
      this.dominioMaestroService.listarDominios().subscribe({
        next: (page: any) => {
          this.dataSourceDominios = new MatTableDataSource(page.data);
          this.dataSourceDominios.sort = this.sort;
          this.cantidadRegistros = page.data.totalElements;
        },
        error: (err: any) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE + " - " + err.error?.response?.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        }
      })
    }
  }

  listarCodigoSeleccionado() {
    this.generalesService.listarDominioXDominio({
      'dominioPK.dominio': this.elementoDominioActualizar.dominio
    }).subscribe({
      next: (page: any) => {
        this.dataSourceCodigos = new MatTableDataSource(page.data);
        this.dataSourceCodigos.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE + " - " + err.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })
  }

  /**
  * Evento que levanta un openDialog para crear una tabla de dominio
  * @JuanMazo
  */
  crearTablaDominio() {
    const _dialogRef = this.dialog.open(DialogTablaDominioComponent, {
      width: '700px',
      data: { titulo: "Crear " }
    })
    _dialogRef.afterClosed().subscribe(result => {
      this.isDominioChecked = true
      this.listarDominios();
    })
  }

  eventoClick(element: any) {
    this.btnEstado = false;
    this.mostrarTablaCodigos = true
    this.elementoDominioActualizar = element;
    this.listarCodigoSeleccionado()
  }

  eventoClickCodigo(element: any) {
    this.mostrarBtnDescripcionCodigo = true;
    this.mostrarBtnEliminarCodigo = true;
    this.elementoCodigo = element;
  }

  /**
 * Evento que levanta un openDialog para actualizar una tabla de dominio
 * @JuanMazo
 */
  actualizarTablaDominio() {
    const _dialogRef = this.dialog.open(DialogTablaDominioComponent, {
      width: '700PX',
      data: { data: this.elementoDominioActualizar, titulo: "Actualizar " }
    })
    _dialogRef.afterClosed().subscribe(result => {
      this.listarDominios();
    })
  }

  /**
* Evento que levanta un openDialog para crear un identificador segun el id de un dominio
* @JuanMazo
*/
  crearCodigo() {
    this.dialog.open(DialogIdentificadorDominioComponent, {
      width: '700PX'
    })
  }

  /**
* Evento que levanta un openDialog para modificar un identificador segun el id de un dominio
* @JuanMazo
*/
  modificarIdentificador() {
    this.dialog.open(DialogIdentificadorDominioComponent, {
      width: '700PX'
    })
  }

  /**
* Evento que levanta un openDialog para eliminar un identificador segun el id de un dominio
* @JuanMazo
*/
  eliminarIdentificador() {
    this.dialog.open(DialogEliminarIdentificadorComponent, {
      width: '700PX'
    })
  }

}
