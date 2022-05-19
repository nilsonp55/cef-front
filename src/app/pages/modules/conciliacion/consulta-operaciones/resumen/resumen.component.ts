import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { ErrorService } from 'src/app/_model/error.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //DataSource para pintar tabla de resumenes
  dataSourceInfoArchivo: MatTableDataSource<ArchivoCargadoModel>;
  displayedColumnsInfoArchivo: string[] = ['nombreOperacion', 'fechaOperacion', 'numeroOperaciones', 'estado'];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService
  ) { }

  ngOnInit(): void {
    this.listarResumenOperaciones();
  }

  /**
  * Se realiza consumo de servicio para listr el resumen de operaciones
  * @BaironPerez
  */
  listarResumenOperaciones(pagina = 0, tamanio = 5) {
    this.opConciliadasService.obtenerResumen().subscribe((page: any) => {
      this.dataSourceInfoArchivo = new MatTableDataSource(page.data.content);
      this.dataSourceInfoArchivo.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al obtener resumen de operaciones',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close()}, 3000);    
      });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listarResumenOperaciones(e.pageIndex, e.pageSize);
  }

}
