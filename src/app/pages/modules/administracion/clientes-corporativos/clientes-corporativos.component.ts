import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { FormClientesCorpComponent } from './form-clientes-corp/form-clientes-corp.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';

@Component({
  selector: 'app-clientes-corporativos',
  templateUrl: './clientes-corporativos.component.html',
  styleUrls: ['./clientes-corporativos.component.css'],
})

/**
 * @author prv_nparra
 */
export class ClientesCorporativosComponent implements OnInit {
  totalRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pIndex: number = 0;
  pSize: number = 10;
  spinnerActive: boolean = false;
  dsClientesCorporativos: MatTableDataSource<any>;
  displayColumnsClientes: String[] = [
    'codigo_cliente',
    'banco',
    'nombre_cliente',
    'tipo_id',
    'identificacion',
    'tarifa_separacion',
    'amparado',
    'acciones',
  ];
  bancos: any[] = [];

  constructor(
    private dialog: MatDialog,
    private clientesCorporativosServices: ClientesCorporativosService,
    private generalesService: GeneralesService
  ) {}

  ngOnInit(): void {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
    this.listarBancos();
    this.listarClientesCorporativos(0, 10);
  }

  /**
   * @author prv_nparra
   */
  getNombreBanco(data: any): string {
    let banco = this.bancos.find((value) => value.codigoPunto === data);
    return banco !== undefined ? banco.nombreBanco : '';
  }

  resolveAmparado(amparado: boolean): string {
    return amparado ? "Si" : "No";
  }

  /**
   * @author prv_nparra
   */
  listarClientesCorporativos(pagina = this.pIndex, tamanio = this.pSize) {
    this.spinnerActive = true;
    this.dsClientesCorporativos = new MatTableDataSource();
    this.clientesCorporativosServices
      .listarClientesCorporativos({
        page: pagina,
        size: tamanio,
      })
      .subscribe({
        next: (page: any) => {
          this.dsClientesCorporativos = new MatTableDataSource(
            page.data.content
          );
          this.totalRegistros = page.data.totalElements;
          this.pageSizeOptions = [5, 10, 25, 100, page.data.totalElements];
          this.spinnerActive = false;
        },
        error: (errors: any) => {
          this.spinnerActive = false;
        },
      });
  }

  /**
   * @author prv_nparra
   */
  async listarBancos() {
    await lastValueFrom(this.generalesService.listarBancosAval()).then(
      (response) => {
        this.bancos = response.data;
      }
    );
  }

  /**
   * @author prv_nparra
   */
  mostrarMas(e: any) {
    this.pIndex = e.pageIndex;
    this.pSize = e.pageSize;
    this.listarClientesCorporativos(e.pageIndex, e.pageSize);
  }

  /**
   * @author prv_nparra
   */
  openFormClienteCorporativo(element: any, accion: string) {
    // abrir dialog para crear o editar cliente
    this.dialog
      .open(FormClientesCorpComponent, {
        width: GENERALES.DIALOG_FORM.SIZE_FORM,
        data: { flag: accion, row: element, bancos: this.bancos },
      })
      .afterClosed()
      .subscribe((result) => {});
  }

  /**
   * @author prv_nparra
   */
  confirmEliminarClienteCorporativo(element: any) {
    this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.MSG_DELETE_ROW,
        codigo: GENERALES.CODE_EMERGENT.WARNING,
        showActions: true
      }
    }).afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.eliminarClienteCorporativo(element);
        this.listarClientesCorporativos(this.pIndex, this.pSize);
      }
    });
  }

  /**
   * @author prv_nparra
   */
  eliminarClienteCorporativo(element: any) {
    this.spinnerActive = true;
    this.clientesCorporativosServices
      .eliminarClientesCorporativos({ codigoCliente: element.codigoCliente })
      .subscribe({
        next: (response: any) => {
          this.spinnerActive = false;
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_DELETE,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          });
        },
        error: (err: any) => {
          this.spinnerActive = false;
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DELETE + " - " + err.mensaje,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        },
      });
  }
}
