import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { FormClientesCorpComponent } from './form-clientes-corp/form-clientes-corp.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-clientes-corporativos',
  templateUrl: './clientes-corporativos.component.html',
  styleUrls: ['./clientes-corporativos.component.css']
})

/**
 * @author prv_nparra
 */
export class ClientesCorporativosComponent implements OnInit {

  totalRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  spinnerActive: boolean = false;
  dsClientesCorporativos: MatTableDataSource<any>;
  displayColumnsClientes: String[] = ['row_num', 'codigo_cliente', 'banco', 'nombre_cliente', 'tipo_id', 'identificacion', 'tarifa_separacion', 'amparado', 'acciones'];
  bancos: any[] = [];

  constructor(
    private dialog: MatDialog,
    private clientesCorporativosServices: ClientesCorporativosService,
    private generalesService: GeneralesService) { }

  ngOnInit(): void {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
    this.listarBancos();
    this.listarClientesCorporativos(0, 10);
  }

  /**
   * @author prv_nparra
   */
  listarClientesCorporativos(pagina = 0, tamanio = 10) {
    this.spinnerActive = true;
    this.dsClientesCorporativos = new MatTableDataSource();
    this.clientesCorporativosServices.listarClientesCorporativos({
      page: pagina,
      size: tamanio
    }).subscribe({
      next: (page: any) => {
        this.dsClientesCorporativos = new MatTableDataSource(page.data.content);
        this.totalRegistros = page.data.totalElements;
        this.pageSizeOptions = [5, 10, 25, 100, page.data.totalElements];
        this.spinnerActive = false;

      },
      error: (errors: any) => {
        this.spinnerActive = false;
      }
    });
  }

  async listarBancos() {
    await lastValueFrom(this.generalesService.listarBancosAval())
      .then((response) => {
        this.bancos = response.data;
      });
  }

  /**
   * @author prv_nparra
   */
  mostrarMas(e: any) {
    this.listarClientesCorporativos(e.pageIndex, e.pageSize);
  }

  /**
   * @author prv_nparra
   */
  openFormClienteCorporativo(element: any, accion: string) {
    // abrir dialog para crear o editar cliente
    this.dialog.open(FormClientesCorpComponent, { width: '70%', data: { flag: accion, row: element, bancos: this.bancos } })
      .afterClosed().subscribe(result => {
      });
  }


  /**
   * @author prv_nparra
   */
  eliminarClienteCorporativo(element: any) { }

}
