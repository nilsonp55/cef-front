import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { ProcedimientosAlmacenadosService } from 'src/app/_service/administracion-service/procedimientos-almacenados.service';
import { EjecutarProcedimientoComponent } from './ejecutar-procedimiento/ejecutar-procedimiento.component';

@Component({
  selector: 'app-gestion-procedimientos',
  templateUrl: './gestion-procedimientos.component.html',
  styleUrls: ['./gestion-procedimientos.component.css']
})
export class GestionProcedimientosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de los procesos a ejecutar
  fechaSistemaSelect: any;
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['nombreFuncion', 
    'descripcionFuncion', 
    'cantidadParametros', 
    //'estado', 
    'acciones'
  ];

  constructor(
    private readonly dialog: MatDialog,
    private readonly procedimientosAlmacenadosService: ProcedimientosAlmacenadosService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinnerActive = true
    ManejoFechaToken.manejoFechaToken()
    this.listarProcesos();
  }

  /**
  * Se realiza consumo de servicio para listr los procesos a ejectar
  * @BaironPerez
  */
  listarProcesos(pagina = 0, tamanio = 10) {
    this.procedimientosAlmacenadosService.obtenerProcedimientos({
      page: pagina,
      size: tamanio,
    }).subscribe({ next: (page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
      this.dataSourceInfoProcesos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.spinnerActive = false
    },
    error:  (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        this.spinnerActive = false
      }
    });
  }

  /**
   * Metodo encargado de ejecutar el servicio de ejecutar los procesos
   * procesos activos
   * @BaironPerez
   */
  ejecutar(param) {
    const validateArchivo = this.dialog.open(EjecutarProcedimientoComponent, {
      height: '95%',
      width: '90%',
      data: {
        funcion: param.idFuncion,
        data: param.parametrosFuncionesDinamicasDTO,
      }
    });

    validateArchivo.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
    })
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listarProcesos(e.pageIndex, e.pageSize);
  }

}

