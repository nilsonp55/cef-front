import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { BancoModel } from 'src/app/_model/banco.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';

@Component({
  selector: 'app-filtro-banco-tdv',
  templateUrl: './filtro-banco-tdv.component.html',
  styleUrls: ['./filtro-banco-tdv.component.css']
})

/**
 * Componente general para fultrar por banco y tdv del grupo aval
 * @JuanMazo
 */
export class FiltroBancoTdvComponent implements OnInit {

  tranportadoraOptions: TransportadoraModel[]
  bancoOptions: BancoModel[]
  estadosConciliacionOptions: any[];
  selectedOrigen = [];
  selectedDestino = [];
  estadoConciliacion: any;
  fechaSelected: Date;
  fechaProcesoInternal: Date;

  selectBancoFilter: any;
  selectTrasportadorafilter: any;



  @Input()
  showFilterEstado: boolean = false;
  @Input()
  showFechaProceso: boolean = false;
  @Input()
  set fechaProceso (value: Date){
    if (value != undefined  && value != null){
      this.fechaProcesoInternal = value;
    }
  };
  
  @Input()
  fechaOrigen: any;
  @Input() showPuntoOrigenDestino: boolean = false;

  @Output()
  filterData = new EventEmitter<any>();


  constructor(
    private dialog: MatDialog,
    private generalesService: GeneralesService) { }

  ngOnInit(): void {
    this.listarBancos();
    this.listarTransportadoras();
    this.estadosConciliacionOptions = ['CONCILIADA', 'NO_CONCILIADA', 'FALLIDA', 'FUERA_DE_CONCILIACION', 'POSPUESTA', 'CANCELADA'];
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

  filtrar() {
    this.filterData.emit({
      banco: this.selectBancoFilter,
      trasportadora: this.selectTrasportadorafilter,
      tipoPuntoOrigen: this.selectedOrigen, 
      tipoPuntoDestino: this.selectedDestino,
      estadoConciliacion: this.estadoConciliacion,
      fechaSelected: new Date(this.fechaProcesoInternal)
    });
  }
  limpiar() {
    this.selectBancoFilter = null;
    this.selectTrasportadorafilter = null;
    this.selectedOrigen = null;
    this.estadoConciliacion = null
    this.fechaProceso = null
    this.fechaProcesoInternal  = null
  }
}
