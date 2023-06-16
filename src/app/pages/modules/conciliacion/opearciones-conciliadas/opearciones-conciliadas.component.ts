import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  dataSourceConciliadas: MatTableDataSource<ConciliacionesModel>;
  displayedColumnsConciliadas: string[] = ['banco', 'transPortadora', 'ciudad', 'tipoOperacion', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'ciudadPuntoOrigen', 'ciudadPuntoDestino', 'valor', 'tipoConciliacion', 'fechaEjecucion', 'acciones'];

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
      }).subscribe({
        next: (page: any) => { 
          this.dataSourceConciliadas = new MatTableDataSource(page.data.content);
          this.dataSourceConciliadas.sort = this.sort;
          this.cantidadRegistros = page.data.totalElements;
          
        },
        error: (err: any) => {
          this.dataSourceConciliadas = new MatTableDataSource();
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          setTimeout(() => { alert.close()}, 3000);      
        }
      });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
   mostrarMas(e: any) {
    this.listarConciliados(e.pageIndex, e.pageSize);
  }

  /**
   * Evento que levanta un openDialog para pasar a estado no conciliado los conciliados
   * @JuanMazo
   */
  eventoDesconciliar(event: any) {
    const dialogRef =this.dialog.open(DialogDesconciliarComponent, {
      width: '400PX',
      data: {
        seleccionDescon: event
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.listarConciliados()
    });
  }
  
  filter(event) {}
}
