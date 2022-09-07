import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { ErrorService } from 'src/app/_model/error.model';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ConciliacionesModel } from 'src/app/_model/consiliacion-model/conciliacion.model';

@Component({
  selector: 'app-consulta-opera-conciliadas',
  templateUrl: './consulta-opera-conciliadas.component.html',
  styleUrls: ['./consulta-opera-conciliadas.component.css']
})

/**
 * Clase que nos permite listar las operaciones conciliadas
 * @JuanMazo
 */
export class ConsultaOperaConciliadasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  public load: boolean = false;

  //DataSource para pintar tabla de conciliados
  dataSourceConciliadas: MatTableDataSource<ConciliacionesModel>;
  displayedColumnsConciliadas: string[] = ['banco', 'transPortadora', 'ciudad', 'tipoOperacion', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'ciudadPuntoOrigen', 'ciudadPuntoDestino', 'valor', 'tipoConciliacion', 'fechaEjecucion'];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService) { }

    
  ngOnInit(): void {
    this.listarConciliados();
  }

  /** 
 * Se realiza consumo de servicio para listar los conciliaciones
 * @JuanMazo
 */
  listarConciliados(pagina = 0, tamanio = 5) {
    this.opConciliadasService.obtenerConciliados({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.load = true;
      this.dataSourceConciliadas = new MatTableDataSource(page.data.content);
      this.dataSourceConciliadas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;

    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_OBTENER_CONCILIADOS,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

   /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
    mostrarMas(e: any) {
      this.listarConciliados(e.pageIndex, e.pageSize);
    }

}
