import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ErrorService } from 'src/app/_model/error.model';
import { VentanaEmergenteResponseComponent } from '../ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from '../../constantes';
import { GeneralesService } from 'src/app/_service/generales.service';
import { MatDialog } from '@angular/material/dialog';
import { GestionPuntosService } from 'src/app/_service/gestion-puntos-service/gestionPuntos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, startWith } from 'rxjs';
import { map, concatMap, tap, debounceTime, switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-filtro-conciliacion-transporte',
  templateUrl: './filtro-conciliacion-transporte.component.html',
  styleUrls: ['./filtro-conciliacion-transporte.component.css']
})
export class FiltroConciliacionTransporteComponent implements OnInit {

  @Output()
  filterData = new EventEmitter<any>();
  @Input() pantalla: any;

  filtrosFormGroup: FormGroup;
  btnBuscar: boolean = false;
  /**Arrays Datos */
  entidadData: any[] = [];
  identificacionClienteData: any[] = [];
  razonSocialData: any[] = [];
  codigoPuntoCargoData: any[] = [];
  nombrePuntoCargoData: any[] = [];
  ciudadFondoData: any[] = [];
  nombreTipoServicioData: any[] = [];
  monedaDivisaData: any[] = [];
  estadoData: any[] = [];
  nombreTipoOperacionData: any[] = [];

  /**Observables autocomplete */
  entidadOptions: Observable<any[]>;
  identificacionClienteOptions: Observable<any[]>;
  razonSocialOptions: Observable<any[]>;
  codigoPuntoCargoOptions: Observable<any[]>;
  nombrePuntoCargoOptions: Observable<any[]>;
  ciudadFondoOptions: Observable<any[]>;
  nombreTipoServicioOptions: Observable<any[]>;
  monedaDivisaOptions: Observable<any[]>;
  estadoOptions: Observable<any[]>;
  nombreTipoOperacionOptions: Observable<any[]>;

  constructor(
    private dialog: MatDialog,
    private generalesService: GeneralesService,
    private gestionPuntosService: GestionPuntosService,
    private fb: FormBuilder
  ) {
    this.filtrosFormGroup = this.fb.group({
      entidad: [''],
      fechaSerTrans: ['', Validators.required],
      fechaSerTransFinal: ['', Validators.required],
      identificacionCliente: [''],
      razonSocial: [''],
      codigoPuntoCargo: [''],
      nombrePuntoCargo: [''],
      ciudadFondo: [''],
      nombreTipoServicio: [''],
      nombreTipoOperacion: [''],
      monedaDivisa: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.entidadOptions = this.filtrosFormGroup.controls['entidad'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarBancos(value, 'nombreBanco')),
    );

    this.identificacionClienteOptions = this.filtrosFormGroup.controls['identificacionCliente'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarIdentificacionCliente(value, 'identificacion')),
      map(value => value.sort((a, b) => this.ordenarListado(a, b, 'identificacion'))),
    );

    this.razonSocialOptions = this.filtrosFormGroup.controls['razonSocial'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarRazonSocial(value, 'nombreCliente')),
      map(value => value.sort((a, b) => this.ordenarListado(a, b, 'nombreCliente'))),
    );

    this.codigoPuntoCargoOptions = this.filtrosFormGroup.controls['codigoPuntoCargo'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarCodigoPuntoCargo(value, 'codigoPunto')),
      map(value => value.sort((a, b) => this.ordenarListado(a, b, 'codigoPunto'))),
    );

    this.nombrePuntoCargoOptions = this.filtrosFormGroup.controls['nombrePuntoCargo'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarNombrePuntoCargo(value, 'codigoPropioTDV')),
      map(value => value.sort((a, b) => this.ordenarListado(a, b, 'codigoPropioTDV'))),
    );

    this.ciudadFondoOptions = this.filtrosFormGroup.controls['ciudadFondo'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarCiudadFondo(value, 'nombreCiudad')),
      map(value => value.sort((a, b) => this.ordenarListado(a, b, 'nombreCiudad'))),
    );

    this.nombreTipoServicioOptions = this.filtrosFormGroup.controls['nombreTipoServicio'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarNombreTipoServicio(value)),
      map(value => value.sort((a, b) => this.ordenarListado(a, b))),
    );

    this.nombreTipoOperacionOptions = this.filtrosFormGroup.controls['nombreTipoServicio'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarNombreTipoOperacion(value)),
      map(value => value.sort((a, b) => this.ordenarListado(a, b))),
    );

    this.monedaDivisaOptions = this.filtrosFormGroup.controls['monedaDivisa'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarMonedaDivisa(value)),
      map(value => value.sort((a, b) => this.ordenarListado(a, b))),
    );

    this.estadoOptions = this.filtrosFormGroup.controls['estado'].valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.filtrarEstado(value)),
      map(value => value.sort((a, b) => this.ordenarListado(a, b))),
    );
  }

  private filtrarBancos(value: string, property: string): Observable<any> {
    return this.listarBancos().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option[property].toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarBancos(): Observable<any> {
    return this.entidadData.length ? of(this.entidadData) : this.generalesService.listarBancosAval().pipe(tap((data: any) => this.entidadData = data.data));
  }

  private filtrarIdentificacionCliente(value: string, property: string): Observable<any> {
    return this.listarIdentificacionCliente().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option[property].indexOf(value) >= 0 });
      }));
  }

  private listarIdentificacionCliente() {
    return this.identificacionClienteData.length ? of(this.identificacionClienteData) : this.generalesService.listarClientes().pipe(tap((data: any) => this.identificacionClienteData = data.data));
  }

  private filtrarRazonSocial(value: string, property: string): Observable<any> {
    return this.listarRazonSocial().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option[property].toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarRazonSocial() {
    return this.razonSocialData.length ? of(this.razonSocialData) : this.generalesService.listarClientes().pipe(tap((data: any) => this.razonSocialData = data.data));
  }

  private filtrarCodigoPuntoCargo(value: string, property: string): Observable<any> {
    return this.listarCodigoPuntoCargo().pipe(
      map((data: any) => {
        let options = data['data'] && data['data']['content'] ? data['data']['content'] : data;
        return options.filter(option => { return option[property].toString().indexOf(value) >= 0 });
      }));
  }

  private listarCodigoPuntoCargo() {
    return this.codigoPuntoCargoData.length ? of(this.codigoPuntoCargoData) : this.gestionPuntosService.listarPuntosCreadosTDV({ page: 0, size: 0 }).pipe(tap((data: any) => this.codigoPuntoCargoData = data.data.content));
  }

  private filtrarNombrePuntoCargo(value: string, property: string): Observable<any> {
    return this.listarNombrePuntoCargo().pipe(
      map((data: any) => {
        let options = data['data'] && data['data']['content'] ? data['data']['content'] : data;
        return options.filter(option => { return option[property].toString().toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarNombrePuntoCargo() {
    return this.nombrePuntoCargoData.length ? of(this.nombrePuntoCargoData) : this.gestionPuntosService.listarPuntosCreadosTDV({ page: 0, size: 0 }).pipe(tap((data: any) => this.nombrePuntoCargoData = data.data.content));
  }

  private filtrarCiudadFondo(value: string, property: string): Observable<any> {
    return this.listarCiudadFondo().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option[property].toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarCiudadFondo() {
    return this.ciudadFondoData.length ? of(this.ciudadFondoData) : this.generalesService.listarCiudades().pipe(tap((data: any) => this.ciudadFondoData = data.data));
  }

  private filtrarNombreTipoServicio(value: string): Observable<any> {
    return this.listarNombreTipoServicio().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option.toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarNombreTipoServicio() {
    return this.nombreTipoServicioData.length ? of(this.nombreTipoServicioData) : this.generalesService.listarDominioByDominio({ 'dominio': "TIPO_SERVICIO" }).pipe(tap((data: any) => this.nombreTipoServicioData = data.data));
  }

  private filtrarNombreTipoOperacion(value: string): Observable<any> {
    return this.listarNombreTipoOperacion().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option.toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarNombreTipoOperacion() {
    return this.nombreTipoOperacionData.length ? of(this.nombreTipoOperacionData) : this.generalesService.listarDominioByDominio({ 'dominio': "TIPO_OPERACION" }).pipe(tap((data: any) => this.nombreTipoOperacionData = data.data));
  }

  private filtrarMonedaDivisa(value: string): Observable<any> {
    return this.listarMonedaDivisa().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option.toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarMonedaDivisa() {
    return this.monedaDivisaData.length ? of(this.monedaDivisaData) : this.generalesService.listarDominioByDominio({ 'dominio': "DIVISAS" }).pipe(tap((data: any) => this.monedaDivisaData = data.data));
  }

  private filtrarEstado(value: string): Observable<any> {
    return this.listarEstado().pipe(
      map((data: any) => {
        let options = data['data'] ? data['data'] : data;
        return options.filter(option => { return option.toLowerCase().indexOf(value.toLowerCase()) >= 0 });
      }));
  }

  private listarEstado() {
    return this.estadoData.length ? of(this.estadoData) : this.generalesService.listarDominioByDominio({ 'dominio': "ESTADO_TRANS_PROC" }).pipe(tap((data: any) => this.estadoData = data.data));
  }

  ordenarListado(a, b, prop?) {
    if (prop) {
      if (a[prop] < b[prop])
        return -1;
      if (a[prop] > b[prop])
        return 1;
      return 0;
    } else {
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      return 0;
    }

  };

  filter() {
    if (this.btnBuscar && this.filtrosFormGroup.valid) {
      this.filterData.emit({
        entidad: this.filtrosFormGroup.get('entidad').value ? this.filtrosFormGroup.get('entidad').value : undefined,
        fechaServicioTransporte: this.filtrosFormGroup.get('fechaSerTrans').value ? new Date(this.filtrosFormGroup.get('fechaSerTrans').value).toLocaleDateString('zh-Hans-CN', { year: "numeric", month: "2-digit", day: "2-digit" }) : undefined,
        fechaServicioTransporteFinal: this.filtrosFormGroup.get('fechaSerTransFinal').value ? new Date(this.filtrosFormGroup.get('fechaSerTransFinal').value).toLocaleDateString('zh-Hans-CN', { year: "numeric", month: "2-digit", day: "2-digit" }) : undefined,
        identificacionCliente: this.filtrosFormGroup.get('identificacionCliente').value ? this.filtrosFormGroup.get('identificacionCliente').value : undefined,
        razonSocial: this.filtrosFormGroup.get('razonSocial').value ? this.filtrosFormGroup.get('razonSocial').value : undefined,
        codigoPuntoCargo: this.filtrosFormGroup.get('codigoPuntoCargo').value ? this.filtrosFormGroup.get('codigoPuntoCargo').value : undefined,
        nombrePuntoCargo: this.filtrosFormGroup.get('nombrePuntoCargo').value ? this.filtrosFormGroup.get('nombrePuntoCargo').value : undefined,
        ciudadFondo: this.filtrosFormGroup.get('ciudadFondo').value ? this.filtrosFormGroup.get('ciudadFondo').value : undefined,
        nombreTipoServicio: this.filtrosFormGroup.get('nombreTipoServicio').value ? this.filtrosFormGroup.get('nombreTipoServicio').value : undefined,
        nombreTipoOperacion: this.filtrosFormGroup.get('nombreTipoOperacion').value ? this.filtrosFormGroup.get('nombreTipoOperacion').value : undefined,
        monedaDivisa: this.filtrosFormGroup.get('monedaDivisa').value ? this.filtrosFormGroup.get('monedaDivisa').value : undefined,
        estado: this.filtrosFormGroup.get('estado').value ? this.filtrosFormGroup.get('estado').value : undefined,
      });
    } else {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_VLIDACION_FECHAS.REQUIRED_RANGE_DATE,
          codigo: GENERALES.CODE_EMERGENT.WARNING
        }
      });
      setTimeout(() => { alert.close() }, 3000);
    }

  }

  alertError() {
    const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: GENERALES.MESSAGE_ALERT.MESSAGE_BANCO.ERROR_BANCO,
        codigo: GENERALES.CODE_EMERGENT.ERROR
      }
    });
    setTimeout(() => { alert.close() }, 3000);
  }

  selectFechaServicioTransporteF(event) {
    this.btnBuscar = true
  }

  limpiar() {
    this.filtrosFormGroup.reset();
    this.btnBuscar = false
  }

  clearDate(event) {
    event.stopPropagation();
    this.filtrosFormGroup.patchValue({
      fechaSerTrans: '',
      fechaSerTransFinal: ''
    });
    this.btnBuscar = false
  }
}
