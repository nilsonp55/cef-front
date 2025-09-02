import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
  styleUrls: ['./administracion-dominios.component.css'],
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
  @ViewChild('sortDominios') sortDominios: MatSort;
  @ViewChild('sortCodigos') sortCodigos: MatSort;

  //Registros paginados
  cantidadRegistros: number;

  displayedColumns: string[] = ['name'];
  clickedRows = new Set<any>();

  displayedColumnsIdent: string[] = [
    'codigo',
    'descripcion',
    'tipo',
    'valorTexto',
    'valorNumero',
    'valorFecha',
    'acciones',
  ];

  DIALOG_CONFIG = {
    width: '90vw',
      maxWidth:'780px',
    height: 'auto',
    maxHeight: '80vh',
    autoFocus: false,
    disableClose: false,
  } as MatDialogConfig

  spinnerActive: boolean = false;

  constructor(
    private readonly dominioMaestroService: DominioMaestroService,
    private readonly generalesService: GeneralesService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
    this.listarDominios();
  }

  dataSourceCodigos: MatTableDataSource<any>;

  dataSourceDominios: MatTableDataSource<any>;
  displayedColumnsDominios: string[] = [
    'dominio',
    'descripcion',
    'tipoContenido',
    'acciones',
  ];//agregar campo estado si es requerido

  define() {
    this.isDominioChecked = !this.isDominioChecked;
    this.listarDominios();
  }

  defineCodigo() {
    this.listarCodigosDominio();
  }

  interpretaCheckBox() {
    this.isIdentChecked ? (this.valorEstado = '1') : (this.valorEstado = '');
    return this.valorEstado;
  }

  listarCodigosDominio() {
    this.generalesService
      .listarDominioXDominio({
        'dominioPK.dominio': this.elementoDominioActualizar.dominio,
        estado: this.interpretaCheckBox(),
      })
      .subscribe({
        next: (page: any) => {
          this.dataSourceCodigos = new MatTableDataSource(page.data);
          this.dataSourceCodigos.sort = this.sortCodigos;
          this.cantidadRegistros = page.data.totalElements;
        },
        error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err?.error.response),
            },
          });
        },
      });
  }


  listarDominios(){
    this.dominioMaestroService.listarDominios().subscribe({
      next: (page: any) => {
        this.dataSourceDominios = new MatTableDataSource(page.data);
        this.dataSourceDominios.sort = this.sortDominios;
        this.cantidadRegistros = page.data.totalElements;
        this.spinnerActive = false;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err),
          },
        });
        this.spinnerActive = false;
      },
    });
  }

  listarCodigoSeleccionado() {
    this.generalesService
      .listarDominioXDominio({
        'dominioPK.dominio': this.elementoDominioActualizar.dominio,
      })
      .subscribe({
        next: (page: any) => {
          this.dataSourceCodigos = new MatTableDataSource(page.data);
          this.dataSourceCodigos.sort = this.sortCodigos;
          this.dataSourceCodigos.sortingDataAccessor = (data, sortHeaderId) => {
            switch (sortHeaderId) {
              case 'codigo':
                return data.id.codigo;
              default:
                return data[sortHeaderId];
            }
          }
          this.cantidadRegistros = page.data.totalElements;
        },
        error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err?.error.response),
            },
          });
        },
      });
  }

  /**
   * Evento que levanta un openDialog para crear una tabla de dominio
   * @JuanMazo
   */
  crearTablaDominio() {
    const _dialogRef = this.dialog.open(DialogTablaDominioComponent, {
      ...this.DIALOG_CONFIG,
      data: { titulo: 'Crear ' },
    });
    _dialogRef.afterClosed().subscribe((result) => {
      this.isDominioChecked = true;
      this.listarDominios();
    });
  }

  eventoClick(element: any) {
    this.btnEstado = false;
    this.mostrarTablaCodigos = true;
    this.elementoDominioActualizar = element;
    this.listarCodigoSeleccionado();
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
  actualizarTablaDominio(element: any) {
    const _dialogRef = this.dialog.open(DialogTablaDominioComponent, {
      ...this.DIALOG_CONFIG,
      data: { data: element, titulo: 'Actualizar ' },
    });
    _dialogRef.afterClosed().subscribe((result) => {
      this.listarDominios();
    });
  }

  /**
   * Evento que levanta un openDialog para crear un identificador segun el id de un dominio
   * @JuanMazo
   */
  mostrarCodigo(action: string, element: any) {
    if (element === null) {
      element = {
        id: { dominio: this.elementoDominioActualizar.dominio },
        tipo: this.elementoDominioActualizar.tipoContenido,
      };
    }

    const dialogRef = this.dialog.open(DialogIdentificadorDominioComponent, {
      ...this.DIALOG_CONFIG,
      data: { flag: action, row: element },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.listarCodigoSeleccionado();
    });
  }

  /**
   * Evento que levanta un openDialog para eliminar un identificador segun el id de un dominio
   * @JuanMazo
   */
  eliminarIdentificador() {
    this.dialog.open(DialogEliminarIdentificadorComponent, {
      width: GENERALES.DIALOG_FORM.SIZE_FORM,
      height: GENERALES.DIALOG_FORM.SIZE_FORM,
    });
  }
}
