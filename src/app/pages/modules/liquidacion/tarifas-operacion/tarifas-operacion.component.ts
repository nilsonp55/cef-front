import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { ErrorResponse } from 'src/app/_model/error-response.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { TarifasOperacionService } from 'src/app/_service/liquidacion-service/tarifas-operacion.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-tarifas-operacion',
  templateUrl: './tarifas-operacion.component.html',
  styleUrls: ['./tarifas-operacion.component.css']
})
export class TarifasOperacionComponent implements OnInit {

  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['banco', 'tdv', 'tipoPunto', 'tOperacion', 'tServicio', 'escala', 'comisionAplicar', 'billetes', 'monedas', 'fajado', 'valorTarifa', 'estado', 'acciones'];
  mostrarFormulario = false;
  mostrarTabla = true;
  esEdicion: boolean;
  tipoServicio: any;
  bancos: any[] = [];
  tiposCostosCuentas: any[] = [];
  tipoCuentas: any[] = [];
  tipoOperaciones: any[] = [];
  comisionesAplicar: any[] = [];
  tipoServicios: any[] = [];
  escalas: any[] = [];
  transportadoras: any [] = [];
  tiposPuntos: any;

  filtroTipOperacionSelect: any;
  filtroBancoSelect: any;
  filtroTransportaSelect: any;
  filtroEscalaSelect: any;
  filtroTipoPuntoSelect: any;
  filtroTipoServicioSelect: any;

  public fechaVigenciaIni: Date;
  public fechaVigenciaFin: Date;

  registroSeleccionado: any = null;

  //Registros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private generalesService: GeneralesService,
    private tarifasOperacionService: TarifasOperacionService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken();
    await this.iniciarDesplegables();
    this.listarTarifaOperacion();
  }

  /**
   * Lista los Cuentas puc
   * @BayronPerez
   */
   listarTarifaOperacion(pagina = 0, tamanio = 5) {
     this.tarifasOperacionService.consultarTarifasOperacion({
       page: pagina,
       size: tamanio,
       'banco.codigoPunto': this.filtroBancoSelect == undefined ? '' : this.filtroBancoSelect.codigoPunto,
       'transportadora.codigo': this.filtroTransportaSelect == undefined ? '' : this.filtroTransportaSelect.codigo,
       'tipoOperacion': this.filtroTipOperacionSelect == undefined ? '' : this.filtroTipOperacionSelect,
       'escala': this.filtroEscalaSelect == undefined ? '' : this.filtroEscalaSelect,
       'tipoServicio': this.filtroTipoServicioSelect == undefined ? '' : this.filtroTipoServicioSelect
     }).subscribe({
       next: (page: any) => {
         this.dataSourceTiposCuentas = new MatTableDataSource(page.data.content);
         this.dataSourceTiposCuentas.sort = this.sort;
         this.cantidadRegistros = page.data.totalElements;
       },
       error: (err: ErrorResponse) => {
         this.dialog.open(VentanaEmergenteResponseComponent, {
           width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
           data: {
             msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
             codigo: GENERALES.CODE_EMERGENT.ERROR,
             showResume: true,
             msgDetalles: JSON.stringify(err.response)
           }
         });
       }
     });
  }

  /**
    * Se realiza persistencia del formulario de cuentas puc
    * @BayronPerez
    */
  persistir(form: FormGroup) {
    const tarifa = {
      idTarifasOperacion: form.controls['idTarifasOperacion'].value,
      bancoDTO: {
        codigoPunto: form.value['bancoAval'].codigoPunto
      },
      tipoPunto: form.value['tipoPunto'],
      tipoOperacion: form.value['tipoOperacion'],
      tipoServicio: form.value['tipoServicio'],
      escala: form.value['escala'],
      comisionAplicar: form.value['comisionAplicar'],
      tipoImpuesto: Number(form.value['tipoImpuesto']),
      medioPago: form.value['medioPago'],
      transportadoraDTO: {
        codigo: form.value['transportadora'].codigo
      },
      valorTarifa: Number(form.value['valorTarifa']),

      estado: form.value['estado'].value ? 1 : 0,
      billetes: form.value['billetes'] == "null" ? null : form.value['billetes'],
      monedas: form.value['monedas'] == "null" ? null : form.value['monedas'],
      fajado: form.value['fajado'] == "null" ? null : form.value['fajado'],
      fechaVigenciaIni: form.value['fechaVigenciaIni'],
      fechaVigenciaFin: form.value['fechaVigenciaFin'],
      usuarioCreacion: atob(sessionStorage.getItem('user')),
      fechaModificacion: new Date(),
      fechaCreacion: new Date()
    };
    if (this.comparaFechas(form.value['fechaVigenciaIni'], form.value['fechaVigenciaFin'])) {
      if (this.esEdicion) {
        this.tarifasOperacionService.actualizarTarifasOperacion(tarifa).subscribe({
          next: response => {
            this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
                codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
                showResume: true,
                msgDetalles: JSON.stringify(response.response)
              }
            });
          },
          error: (err: any) => {
            console.debug(err);
            this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: err.error.response.description,
                codigo: GENERALES.CODE_EMERGENT.ERROR,
                showResume: true,
                msgDetalles: JSON.stringify(err.error.response)
              }
            });
          }
        });
      } else {
        this.tarifasOperacionService.guardarTarifasOperacion(tarifa).subscribe({
          next: response => {
            this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
                codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
                showResume: true,
                msgDetalles: JSON.stringify(response.response)
              }
            });
          },
          error: (err: ErrorResponse) => {
            this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: err.response.description,
                codigo: GENERALES.CODE_EMERGENT.ERROR,
                showResume: true,
                msgDetalles: JSON.stringify(err.response)
              }
            });
          }
        });
      }
      this.listarTarifaOperacion();
    } else {
      this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_VLIDACION_FECHAS.ERROR_DATE,
          codigo: GENERALES.CODE_EMERGENT.WARNING
        }
      });
    }

  }

  async iniciarDesplegables() {

    await lastValueFrom(this.generalesService.listarBancosAval()).then(
      response => this.bancos = response.data
    );

    await lastValueFrom(this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_OPERACION"
    })).then(
      response => this.tipoOperaciones = response.data
    );

    await lastValueFrom(this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_SERVICIO"
    })).then(
      response => this.tipoServicios = response.data
    );

    await lastValueFrom(this.generalesService.listarDominioByDominio({
      'dominio':"COMISION_APLICAR"
    })).then(
      response => this.comisionesAplicar = response.data
    );    

    await lastValueFrom(this.generalesService.listarDominioByDominio({
      'dominio':"ESCALA"
    })).then(
      response => this.escalas = response.data
    );

    await lastValueFrom(this.generalesService.listarTransportadoras()).then(
      response => this.transportadoras = response.data
    );

    await lastValueFrom(this.generalesService.listarDominioByDominio({ 
      'dominio': 'TIPOS_PUNTO' 
    })).then(
      response => this.tiposPuntos = response.data
    );

  }

  crearTarifaOperacion() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.mostrarTabla = false;

  }

  actualizarTarifaOperacion() {
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.mostrarFormulario = true;
    this.esEdicion = true;
    this.mostrarTabla = false;
  }

  mostrarMas(e: any) {
    this.listarTarifaOperacion(e.pageIndex, e.pageSize);
  }

  comparaFechas(fInicial: any, fFinal: any): boolean {
    if(fInicial  < fFinal){
      return true;
    }
    else {
      return false;
    }
  }

  filtrar(event) {
    this.filtroBancoSelect;
    this.filtroTransportaSelect;
    this.filtroTipOperacionSelect;
    this.listarTarifaOperacion();
  }

  abrirFormulario(registro) {
    this.registroSeleccionado = registro;
    this.mostrarTabla = false;
    this.mostrarFormulario = true;
    this.esEdicion = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.mostrarTabla = true;
    this.registroSeleccionado = null;
    // this.esEdicion = false;
  }

  onGuardar(form: FormGroup) {
    // Guardar o actualizar registro
    this.persistir(form);
    this.cerrarFormulario();
    // Recargar tabla si es necesario
  }

}
