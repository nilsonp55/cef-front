import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorService } from 'src/app/_model/error.model';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ConciliacionesModel } from 'src/app/_model/consiliacion-model/conciliacion.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { DialogDesconciliarComponent } from './dialog-desconciliar/dialog-desconciliar.component';

@Component({    
  selector: 'app-opearciones-conciliadas',
  templateUrl: './opearciones-conciliadas.component.html',
  styleUrls: ['./opearciones-conciliadas.component.css']
})

/**
 * Clase que lista la operaciones conciliadas y nos permite llamar al Mat Dialog para hacer la desconciliación
 * @JuanMazo
 */
export class OpearcionesConciliadasComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;


  //DataSource para pintar tabla de conciliados
  dataSourceInfoArchivo: MatTableDataSource<ConciliacionesModel>;
  displayedColumnsInfoArchivo: string[] = ['banco', 'transPortadora', 'ciudad', 'tipoOperacion', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'ciudadPuntoOrigen', 'ciudadPuntoDestino', 'valor', 'tipoConciliacion', 'fechaEjecucion', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService) { }

  ngOnInit(): void {
    this.listarConciliados();
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @JuanMazo
  */
   mostrarMas(e: any) {
    //this.listarArchivosCargados(e.pageIndex, e.pageSize);
  }

   /** 
  * Se realiza consumo de servicio para listar los conciliaciones
  * @JuanMazo
  */
    listarConciliados() {
      this.opConciliadasService.obtenerConciliados().subscribe((page: any) => { debugger
        this.dataSourceInfoArchivo = new MatTableDataSource(page.data);
        this.dataSourceInfoArchivo.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      
    },
    (err: ErrorService) => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      }); setTimeout(() => { alert.close()}, 3000);      
    });
  }

  /**
   * Evento que levanta un openDialog para pasar a estado no conciliado los conciliados
   * @JuanMazo
   */
  eventoDesconciliar() {
    this.dialog.open(DialogDesconciliarComponent, {
      width: '400PX',
      data: {
        seleccionDescon: event
      }
    })
  }
  
}
