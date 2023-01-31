import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { ProcedimientosAlmacenadosService } from 'src/app/_service/administracion-service/procedimientos-almacenados.service';
import { CierreContabilidadService } from 'src/app/_service/contabilidad-service/cierre-contabilidad.service';
import { EjecutarProcedimientoComponent } from './ejecutar-procedimiento/ejecutar-procedimiento.component';


@Component({
  selector: 'app-gestion-procedimientos',
  templateUrl: './gestion-procedimientos.component.html',
  styleUrls: ['./gestion-procedimientos.component.css']
})
export class GestionProcedimientosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de los procesos a ejecutar
  fechaSistemaSelect: any;
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['nombreFuncion', 'descripcionFuncion', 'cantidadParametros', 'estado', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private cierrecontabilidadService: CierreContabilidadService,
    private procedimientosAlmacenadosService: ProcedimientosAlmacenadosService,
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    this.listarProcesos();
    //this.dataSourceInfoProcesos = new MatTableDataSource(primeraData);
    //this.dataSourceInfoProcesos.sort = this.sort;
  }

  /**
  * Se realiza consumo de servicio para listr los procesos a ejectar
  * @BaironPerez
  */
  listarProcesos(pagina = 0, tamanio = 10) {
    this.procedimientosAlmacenadosService.obtenerProcedimientos({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
      this.dataSourceInfoProcesos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
   * Metodo encargado de ejecutar el servicio de ejecutar los procesos
   * procesos activos
   * @BaironPerez
   */
  ejecutar(param) {
    let data;
    const validateArchivo = this.dialog.open(EjecutarProcedimientoComponent, {
      width: '800px',
      height: '500px',
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


const primeraData = [
  {
      "idFuncion": 2,
      "nombreFuncion": "liquidar_costos",
      "descripcionFuncion": "Funcion Costos",
      "scriptFuncion": "select liquidar_costos(?1)",
      "cantidadParametros": 1,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": "ATH",
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": []
  },
  {
      "idFuncion": 3,
      "nombreFuncion": "ARMAR_PARAMETROS_LIQUIDA",
      "descripcionFuncion": "Funcion Armar Costos",
      "scriptFuncion": "ATH",
      "cantidadParametros": 1,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": null,
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": [
          {
              "idParametro": 3,
              "numeroParametro": 1,
              "nombreParametro": "Fecha",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022",
              "funcionesDinamicasDTO": null
          }
      ]
  },
  {
      "idFuncion": 1,
      "nombreFuncion": "PRUEBA1",
      "descripcionFuncion": "Funcion de prueba",
      "scriptFuncion": "select * from transacciones_internas where estado = ?1 and fecha = ?2;",
      "cantidadParametros": 3,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": "ATH",
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": [
          {
              "idParametro": 1,
              "numeroParametro": 1,
              "nombreParametro": "Estado",
              "tipoDatoParametro": "NUMERO",
              "valorDefecto": "1",
              "posiblesValores": "1, 2, 3, 4",
              "funcionesDinamicasDTO": null
          },
          {
              "idParametro": 2,
              "numeroParametro": 2,
              "nombreParametro": "Fecha Sistema",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022, 23-08-2022",
              "funcionesDinamicasDTO": null
          },
          {
              "idParametro": 4,
              "numeroParametro": 3,
              "nombreParametro": "texto",
              "tipoDatoParametro": "TEXTO",
              "valorDefecto": "a",
              "posiblesValores": "aa",
              "funcionesDinamicasDTO": null
          }
      ]
  },
  {
      "idFuncion": 4,
      "nombreFuncion": "fnc_listar_operaciones_programadas",
      "descripcionFuncion": "Funcion que retorna las operaciones filtradas por un rango de fecha programacion",
      "scriptFuncion": "select fnc_listar_operaciones_programadas(?1, ?2)",
      "cantidadParametros": 2,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": "ATH",
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": [
          {
              "idParametro": 5,
              "numeroParametro": 1,
              "nombreParametro": "fecha inicio",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022",
              "funcionesDinamicasDTO": null
          },
          {
              "idParametro": 6,
              "numeroParametro": 2,
              "nombreParametro": "fecha fin",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022",
              "funcionesDinamicasDTO": null
          }
      ]
  }
]



const segundaData = [
  {
      "idFuncion": 2,
      "nombreFuncion": "liquidar_costos",
      "descripcionFuncion": "Funcion Costos",
      "scriptFuncion": "select liquidar_costos(?1)",
      "cantidadParametros": 1,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": "ATH",
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": []
  },
  {
      "idFuncion": 3,
      "nombreFuncion": "ARMAR_PARAMETROS_LIQUIDA",
      "descripcionFuncion": "Funcion Armar Costos",
      "scriptFuncion": "ATH",
      "cantidadParametros": 1,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": null,
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": [
          {
              "idParametro": 3,
              "numeroParametro": 1,
              "nombreParametro": "Fecha",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022",
              "funcionesDinamicasDTO": null
          }
      ]
  },
  {
      "idFuncion": 1,
      "nombreFuncion": "PRUEBA1",
      "descripcionFuncion": "Funcion de prueba",
      "scriptFuncion": "select * from transacciones_internas where estado = ?1 and fecha = ?2;",
      "cantidadParametros": 3,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": "ATH",
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": [
          {
              "idParametro": 1,
              "numeroParametro": 1,
              "nombreParametro": "Estado",
              "tipoDatoParametro": "NUMERO",
              "valorDefecto": "1",
              "posiblesValores": "1, 2, 3, 4",
              "funcionesDinamicasDTO": null
          },
          {
              "idParametro": 2,
              "numeroParametro": 2,
              "nombreParametro": "Fecha Sistema",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022, 23-08-2022",
              "funcionesDinamicasDTO": null
          },
          {
              "idParametro": 4,
              "numeroParametro": 3,
              "nombreParametro": "texto",
              "tipoDatoParametro": "TEXTO",
              "valorDefecto": "a",
              "posiblesValores": "aa",
              "funcionesDinamicasDTO": null
          }
      ]
  },
  {
      "idFuncion": 4,
      "nombreFuncion": "fnc_listar_operaciones_programadas",
      "descripcionFuncion": "Funcion que retorna las operaciones filtradas por un rango de fecha programacion",
      "scriptFuncion": "select fnc_listar_operaciones_programadas(?1, ?2)",
      "cantidadParametros": 2,
      "estado": 1,
      "usuarioCreacion": "ATH",
      "fechaCreacion": null,
      "usuarioModificacion": "ATH",
      "fechaModificacion": null,
      "parametrosFuncionesDinamicasDTO": [
          {
              "idParametro": 5,
              "numeroParametro": 1,
              "nombreParametro": "fecha inicio",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022",
              "funcionesDinamicasDTO": null
          },
          {
              "idParametro": 6,
              "numeroParametro": 2,
              "nombreParametro": "fecha fin",
              "tipoDatoParametro": "FECHA",
              "valorDefecto": "23/08/2022",
              "posiblesValores": "23/08/2022",
              "funcionesDinamicasDTO": null
          }
      ]
  }
]