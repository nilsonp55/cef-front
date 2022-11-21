import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { GeneralesService } from 'src/app/_service/generales.service'
import { ConfContablesEntidadesService } from 'src/app/_service/contabilidad-service/conf-contables-entidades.service';
import { TarifasOperacionService } from 'src/app/_service/liquidacion-service/tarifas-operacion.service';
import { EscalasService } from 'src/app/_service/liquidacion-service/escalas.service';

@Component({
  selector: 'app-tarifas-operacion',
  templateUrl: './tarifas-operacion.component.html',
  styleUrls: ['./tarifas-operacion.component.css']
})
export class TarifasOperacionComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['banco','tdv', 'tOperacion', 'tServicio', 'escala', 'tipoPunto', 'comisionAplicar', 'valorTarifa', 'billetes', 'monedas', 'fajado', 'estado', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  mostrarTabla = true;
  esEdicion: boolean;
  idCuentaPuc: any;
  idConfEntity: any;
  tipoServicio: any;
  bancos: any[] = [];
  tiposCostosCuentas: any[] = [];
  tipoCuentas: any[] = [];
  tipoOperaciones: any[] = [];
  comisionesAplicar: any[] = [];
  tipoServicios: any[] = [];
  escalas: any[] = [];
  transportadoras: any [] = [];
  idTarifasOperacion: any;
  
  date: any;
  serializedDate: any;

  public fechaVigenciaIni: Date;
  public fechaVigenciaFin: Date;

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private generalesService: GeneralesService,
    private escalasService: EscalasService,
    private tarifasOperacionService: TarifasOperacionService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    await this.iniciarDesplegables();
    this.listarTarifaOperacion();
    this.initForm();
  }

 /**
   * Inicializaion formulario de creacion y edicion
   * @BayronPerez
   */
  initForm(param?: any) {
      this.form = new FormGroup({
        'idTarifasOperacion': new FormControl(param? param.idTarifasOperacion : null),
        'bancoAval': new FormControl(param? this.selectBancoAval(param) : null),
        'tipoOperacion': new FormControl(param? param.tipoOperacion : null),
        'tipoServicio': new FormControl(param? param.tipoServicio : null),
        'escala': new FormControl(param? this.selectEscalas(param) : null),
        'comisionAplicar': new FormControl(param? param.comisionAplicar : null),
        'valorTarifa': new FormControl(param? param.valorTarifa : null),
        'billetes': new FormControl(param? param.billetes : null),
        'monedas': new FormControl(param? param.monedas : null),
        'fajos': new FormControl(param? param.fajos : null),
        'transportadora': new FormControl(param? this.selectTransportadora(param) : null),
        'estado': new FormControl(param? param.estado : null),
        'fechaVigenciaIni': new FormControl(param? param.fechaVigenciaIni : null),
        'fechaVigenciaFin': new FormControl(param? param.fechaVigenciaFin : null),
      });
  }

  selectBancoAval(param: any): any {
    for (let i = 0; i < this.bancos.length; i++) {
      const element = this.bancos[i];
      if(element.codigoPunto == param.bancoDTO.codigoPunto) {
        return element;
      }
    }
  }


  selectTransportadora(param: any): any {
    for (let i = 0; i < this.transportadoras.length; i++) {
      const element = this.transportadoras[i];
      if(element.codigo == param.transportadoraDTO.codigo) {
        return element;
      }
    }
  }

  selectTipoCuentas(param: any): any {
    for (let i = 0; i < this.tipoCuentas.length; i++) {
      const element = this.tipoCuentas[i];
      if(element.tipoCuenta == param.tiposCuentas.tipoCuenta) {
        return element;
      }
    }
  }

  selectEscalas(param: any): any {
    for (let i = 0; i < this.escalas.length; i++) {
      const element = this.escalas[i];
      if(element.escala == param.escala) {
        return element;
      }
    }
  }

  /**
   * Lista los Cuentas puc
   * @BayronPerez
   */
   listarTarifaOperacion(pagina = 0, tamanio = 5) {
    this.tarifasOperacionService.consultarTarifasOperacion({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceTiposCuentas = new MatTableDataSource(page.data.content);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
    * Se realiza persistencia del formulario de cuentas puc
    * @BayronPerez
    */
   persistir() {
    const tarifa = {
      idTarifasOperacion: this.form.value['idTarifasOperacion'],
      bancoDTO: {
        codigoPunto: this.form.value['bancoAval'].codigoPunto
      },
      tipoOperacion: this.form.value['tipoOperacion'],
      tipoServicio: this.form.value['tipoServicio'],
      escala: this.form.value['escala'].escala,
      comisionAplicar: this.form.value['comisionAplicar'],
      tipoImpuesto: Number(this.form.value['tipoImpuesto']),
      medioPago: this.form.value['medioPago'],
      transportadoraDTO: {
        codigo: this.form.value['transportadora'].codigo
      },
      valorTarifa: Number(this.form.value['valorTarifa']),
      estado: Number(this.form.value['estado']),
      billetes: this.form.value['billetes'],
      monedas: this.form.value['monedas'],
      fajado: this.form.value['fajado'],
      fechaVigenciaIni: this.form.value['fechaVigenciaIni'],
      fechaVigenciaFin: this.form.value['fechaVigenciaFin'],
      usuarioCreacion: "User",
      fechaModificacion: new Date(),
      fechaCreacion: new Date()
    };

    if (this.esEdicion) {
      tarifa.idTarifasOperacion = this.idTarifasOperacion;
      this.tarifasOperacionService.actualizarTarifasOperacion(tarifa).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarTarifaOperacion()
        this.initForm();
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
    } else {
      this.tarifasOperacionService.guardarTarifasOperacion(tarifa).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarTarifaOperacion()
        this.initForm();
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
   }

  async iniciarDesplegables() {

    const _bancos = await this.generalesService.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _tipoOperaciones = await this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_OPERACION"
    }).toPromise();
    this.tipoOperaciones = _tipoOperaciones.data;

    const _tipoServicio = await this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_SERVICIO"
    }).toPromise();
    this.tipoServicios = _tipoServicio.data;

    const _comisionAplicar = await this.generalesService.listarDominioByDominio({
      'dominio':"COMISION_APLICAR"
    }).toPromise();
    this.comisionesAplicar = _comisionAplicar.data;

    const _escalas = await this.escalasService.obtenerEscalas().toPromise();
    this.escalas = _escalas.data;

    const _transportadoras = await this.generalesService.listarTransportadoras().toPromise();
    this.transportadoras = _transportadoras.data;

  }

  crearTarifaOperacion() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.form.get('idTarifasOperacion').disable();
    this.mostrarTabla = false;

  }

  actualizarTarifaOperacion() {
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.initForm(registro);
    this.mostrarFormulario = true;
    this.idTarifasOperacion = this.form.get('idTarifasOperacion').value;
    this.form.get('idTarifasOperacion').disable();
    this.esEdicion = true;
    this.mostrarTabla = false;
  }

  irAtras() {
    window.location.reload();
  }

  mostrarMas(e: any) {
    this.listarTarifaOperacion(e.pageIndex, e.pageSize);
  }

}
