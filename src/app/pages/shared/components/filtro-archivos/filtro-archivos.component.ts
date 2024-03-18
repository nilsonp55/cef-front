import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { BancoModel } from 'src/app/_model/banco.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';

@Component({
  selector: 'app-filtro-archivos',
  templateUrl: './filtro-archivos.component.html',
  styleUrls: ['./filtro-archivos.component.css']
})
export class FiltroArchivosComponent implements OnInit {

  tranportadoraOptions: TransportadoraModel[]
  bancoOptions: BancoModel[]
  estadosArchivoOptions: any[];
  tipoArchivoOptions: any[];
  banco: string;
  transportadora: string;
  selectedOrigen = [];
  estado: any;
  fechaSelectTranferI: Date;
  fechaSelectTranferF: Date;
  fechaSelectArchivoI: Date;
  fechaSelectArchivoF: Date;

  @Input()
  showFilterEstado: boolean = false;
  @Input()
  showFechaProceso: boolean = false;
  @Input()
  fechaTransferenciaI: Date;
  @Input()
  fechaTransferenciaF: Date;
  @Input()
  fechaArchivoI: any;
  @Input()
  fechaArchivoF: any;

  @Output()
  filterData = new EventEmitter<any>();
  tipoArchivo: any;


  constructor(
    private dialog: MatDialog,
    private generalesService: GeneralesService) { }

  ngOnInit(): void {
    this.listarBancos();
    this.listarTransportadoras();
    this.listarEstados();
  }

  /** 
  * Se realiza consumo de servicio para listar los transportadoras en el select
  * @JuanMazo
  */
  listarTransportadoras() {
    this.generalesService.listarTransportadoras().subscribe(data => {
      this.tranportadoraOptions = data.data

    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_TRANSPORTE.ERROR_TRANSPORTE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  /** 
  * Se realiza consumo de servicio para listar los bancos en el select
  * @JuanMazo
  */
  listarBancos() {
    this.generalesService.listarBancosAval().subscribe(data => {
      this.bancoOptions = data.data
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_BANCO.ERROR_BANCO,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  async listarEstados() {
    const _estadoArchivo = await this.generalesService.listarDominioByDominio({
      'dominio':"ESTADO_ARCHIVO_LIQUIDACION"
    }).toPromise();
    this.estadosArchivoOptions = _estadoArchivo.data;
    this.listarTipoArchivo();
  }

  async listarTipoArchivo() {
    const _tipoArchivo = await this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_ARCHIVO_LIQUIDACION"
    }).toPromise();
    this.tipoArchivoOptions = _tipoArchivo.data;
  }

  filter() {
    this.filterData.emit({
      banco: this.banco,
      transportadora: this.transportadora,
      fechaSelectArchivoI: this.fechaSelectArchivoI,
      fechaSelectTranferI: this.fechaSelectTranferI,
      fechaSelectArchivoF: this.fechaSelectArchivoF,
      fechaSelectTranferF: this.fechaSelectTranferF,
      estado: this.estado,
      tipoArchivo: this.tipoArchivo
    });
  }

  selectBanco(event) {
    this.banco = event.value;
    this.filter();
  }

  selectTrasportadora(event) {
    this.transportadora = event.value;
    this.filter();
  }

  selectTipoArchivo(event) {
    this.tipoArchivo = event.value;
    this.filter();
  }

  selectEstado(event) {
    this.estado = event.value;
    this.filter();
  }
  selectFechaTranferenciaI(event) {
    this.fechaSelectTranferI = new Date(event.value);
    this.filter();
  }

  selectFechaTranferenciaF(event) {
    this.fechaSelectTranferF = new Date(event.value);
    this.filter();
  }

  selectFechaArchivoI(event) {
    this.fechaSelectArchivoI = new Date(event.value);
    this.filter();
  }

  selectFechaArchivoF(event) {
    this.fechaSelectArchivoF = new Date(event.value);
    this.filter();
  }
}
