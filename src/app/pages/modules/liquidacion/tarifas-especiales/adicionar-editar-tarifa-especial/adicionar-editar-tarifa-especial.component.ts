import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralesService } from 'src/app/_service/generales.service';
import { GestionPuntosService } from 'src/app/_service/gestion-puntos-service/gestionPuntos.service';
import { TarifasEspecialesService } from 'src/app/_service/liquidacion-service/tarifas-especiales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adicionar-editar-tarifa-especial',
  templateUrl: './adicionar-editar-tarifa-especial.component.html',
  styleUrls: ['./adicionar-editar-tarifa-especial.component.css'],
  providers: [{
    provide: DateAdapter, useClass: class extends NativeDateAdapter {
      override format(date: Date, displayFormat: any): string {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
      }
    }
  }]
})
export class AdicionarEditarTarifaEspecialComponent implements OnInit {

  form: FormGroup;
  tipoOperacionesList: any[] = [];
  tipoServiciosList: any[] = [];
  comisionesAplicarList: any[] = [];
  unidadCobroList: any[] = [];
  aplicaAList: any[] = [];
  escalaList: any[] = [];
  transportadorasList: any[] = [];
  tipoComisionList: any[] = [];
  ciudadesList: any[] = [];
  puntosList: any[] = [];
  puntosFiltrados: any[] = [];
  txtEstado: string;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AdicionarEditarTarifaEspecialComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private generalesService: GeneralesService, private gestionPuntosService: GestionPuntosService, private tarifasEspecialesService: TarifasEspecialesService) {

    this.form = this.fb.group({
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
      transportadora: ['', Validators.required],
      ciudad: ['', Validators.required],
      punto: ['', Validators.required],
      tipoOperacion: ['', Validators.required],
      tipoComision: ['', Validators.required],
      valorTarifa: ['', [Validators.required, Validators.pattern(/^\d{1,10}(\.\d{1,6})?$/)]],
      tipoServicio: ['', Validators.required],
      escala: ['', Validators.required],
      unidadCobro: [{ value: '', disabled: true }],
      limiteComision: ['', Validators.pattern(/^\d{1,10}(\.\d{1,6})?$/)],
      valorComisionAdicional: ['', Validators.pattern(/^\d{1,10}(\.\d{1,6})?$/)],
      estado: [true],
      escalas: [false],
      billetes: [false],
      monedas: [false],
      fajado: [false]
    });

  }

  async ngOnInit(): Promise<void> {
    if (this.data.flag === 1) {
      this.txtEstado = 'Editar'
      this.aplicarReglasEdicion(this.data.dataEditar.reglaEdicion)
    } else {
      this.txtEstado = 'Adicionar'
    }
    this.form.get('tipoOperacion')?.valueChanges.subscribe(async (valor) => {
      await this.onTipoOperacionChange(valor);
    });
    await this.iniciarDesplegables();
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  async iniciarDesplegables() {

    const _tipoOperaciones = await this.generalesService.listarDominioByDominio({
      'dominio': "TIPO_OPERACION_TARIFA_ESPECIAL"
    }).toPromise();
    this.tipoOperacionesList = _tipoOperaciones.data;

    const _tipoServicio = await this.generalesService.listarDominioByDominio({
      'dominio': "TIPO_SERVICIO"
    }).toPromise();
    this.tipoServiciosList = _tipoServicio.data;

    const _comisionAplicar = await this.generalesService.listarDominioByDominio({
      'dominio': "COMISION_APLICAR"
    }).toPromise();
    this.comisionesAplicarList = _comisionAplicar.data;

    const _unidadCobro = await this.generalesService.listarDominioByDominio({
      'dominio': "UNIDAD_COBRO"
    }).toPromise();
    this.unidadCobroList = _unidadCobro.data;

    const _aplicaA = await this.generalesService.listarDominioByDominio({
      'dominio': "APLICA_A"
    }).toPromise();
    this.aplicaAList = _aplicaA.data;

    const _escala = await this.generalesService.listarDominioByDominio({
      'dominio': "ESCALA"
    }).toPromise();
    this.escalaList = _escala.data;

    const _tipoComision = await this.generalesService.listarDominioByDominio({
      'dominio': "COMISION_TARIFA_ESPECIAL_RECOLECCION"
    }).toPromise();
    this.tipoComisionList = _tipoComision.data;

    const _transportadoras = await this.generalesService.listarTransportadoras().toPromise();
    this.transportadorasList = _transportadoras.data;

    const _ciudades = await this.gestionPuntosService.listarPuntosAsociados({ 'codigoCliente': this.data.idCliente }).toPromise();
    this.ciudadesList = [
      { codigoNombreCiudad: 'TODAS' },
      ..._ciudades.data.filter(
        (c, index, self) =>
          index === self.findIndex(ci => ci.codigoNombreCiudad === c.codigoNombreCiudad)
      )
    ];

    const _puntos = await this.gestionPuntosService
      .listarPuntosAsociados({ codigoCliente: this.data.idCliente })
      .toPromise();
    this.puntosList = _puntos.data || [];

    if (this.data.flag === 1) {
      if (this.data.dataEditar?.tipoOperacion) {
        await this.onTipoOperacionChange(this.data.dataEditar.tipoOperacion);
      }
      this.setDatosFormulario(this.data.dataEditar);
    }

  }

  onCiudadChange(nombreCiudad: any) {
    if (nombreCiudad.codigoNombreCiudad === 'TODAS') {
      this.puntosFiltrados = [{ nombrePunto: 'TODOS' }];
      this.form.get('punto')?.setValue(this.puntosFiltrados[0]);
      this.form.get('punto')?.disable();
      return this.puntosFiltrados;
    } else {
      this.puntosFiltrados = [
        { nombrePunto: 'TODOS' },
        ...this.puntosList.filter(
          punto => punto.codigoNombreCiudad === nombreCiudad.codigoNombreCiudad
        )
      ];
      this.puntosFiltrados = Array.from(
        new Map(this.puntosFiltrados.map(item => [item.nombrePunto, item])).values()
      );
      if (this.data.flag === 1) {
        this.form.get('punto')?.disable();
      } else {
        this.form.get('punto')?.enable();
      }
      this.form.get('punto')?.reset();
      return this.puntosFiltrados;
    }
  }


  onTipoComisionChange(tipoComision: any) {
    this.form.get('unidadCobro')?.setValue(3200);
    this.form.get('unidadCobro')?.disable();
  }


  async onTipoOperacionChange(valor: string) {
    let dominio = '';
    if (valor === 'RECOLECCION') {
      dominio = 'COMISION_TARIFA_ESPECIAL_RECOLECCION';
    } else if (valor === 'PROVISION') {
      dominio = 'COMISION_TARIFA_ESPECIAL_PROVISION';
    } else {
      this.tipoComisionList = [];
      return;
    }
    try {
      const _tipoComision = await this.generalesService
        .listarDominioByDominio({ dominio })
        .toPromise();
      this.tipoComisionList = _tipoComision.data;
    } catch (err) {
      console.error('Error consultando tipo de comisión:', err);
    }
  }

  validateDecimalInput(event: KeyboardEvent, maxIntegers: number, maxDecimals: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const key = event.key;
    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key)) {
      return;
    }
    if (key === '.') {
      if (value.includes('.')) {
        event.preventDefault();
      }
      return;
    }
    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
      return;
    }
    const cursorPos = input.selectionStart ?? value.length;
    const dotIndex = value.indexOf('.');
    const [integerPart = '', decimalPart = ''] = value.split('.');
    if (dotIndex === -1 || cursorPos <= dotIndex) {
      if (integerPart.length >= maxIntegers) {
        event.preventDefault();
      }
      return;
    }
    if (decimalPart.length >= maxDecimals) {
      event.preventDefault();
    }
  }

  onDecimalBlur(controlName: string, maxIntegers: number, maxDecimals: number) {
    const control = this.form.get(controlName);
    if (!control) return;

    let value: string = control.value;
    if (!value) return;
    if (value.startsWith('.')) {
      value = '0' + value;
    }

    if (value.includes('.')) {
      let [integerPart, decimalPart = ''] = value.split('.');

      if (integerPart.length > maxIntegers) {
        integerPart = integerPart.slice(0, maxIntegers);
      }
      decimalPart = decimalPart.slice(0, maxDecimals);
      if (decimalPart.length > 0) {
        value = `${integerPart}.${decimalPart}`;
      } else {
        value = integerPart;
      }
    } else {
      if (value.length > maxIntegers) {
        value = value.slice(0, maxIntegers);
      }
    }
    control.setValue(value, { emitEvent: false });
  }



  guardarTarifaEspecial() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        text: 'Por favor completa todos los campos obligatorios.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const fieldLabels: Record<string, string> = {
      fechaInicioVigencia: 'El campo Fecha Inicio Vigencia',
      fechaFinVigencia: 'El campo Fecha Fin Vigencia',
      valorTarifa: 'El campo Valor Tarifa',

    };
    const payload = this.form.getRawValue();
    const tarifaEspecial = {
      ...(this.data.flag === 1 && { idTarifaEspecial: this.data.dataEditar.idTarifaEspecial }),
      codigoBanco: this.data.flag === 1 ? this.data.dataEditar.codigoBanco : this.data.codigoBanco,
      codigoTdv: this.data.flag === 1 ? this.data.dataEditar.codigoTdv : payload.transportadora.codigo,
      codigoCliente: this.data.flag === 1 ? this.data.dataEditar.codigoCliente : this.data.idCliente,
      codigoDane: payload.punto?.codigoDane ?? null,
      codigoPunto: this.data.flag === 1 ? this.data.dataEditar.codigoPunto : payload.punto.codigoPunto,
      tipoOperacion: payload.tipoOperacion,
      tipoServicio: payload.tipoServicio,
      tipoComision: payload.tipoComision,
      unidadCobro: payload.unidadCobro || '',
      escala: payload.escala,
      billetes: payload.billetes ? 'SI' : 'NO',
      monedas: payload.monedas ? 'SI' : 'NO',
      fajado: payload.fajado ? 'SI' : 'NO',
      valorTarifa: payload.valorTarifa,
      fechaInicioVigencia: new Date(payload.fechaInicio).toISOString(),
      fechaFinVigencia: new Date(payload.fechaFin).toISOString(),
      limiteComisionAplicar: payload.limiteComision,
      valorComisionAdicional: payload.valorComisionAdicional ? payload.valorComisionAdicional : null,
      usuarioCreacion: this.data.flag === 1 ? this.data.dataEditar.usuarioCreacion : atob(sessionStorage.getItem('user')),
      fechaCreacion: new Date().toISOString(),
      usuarioModificacion: atob(sessionStorage.getItem('user')),
      fechaModificacion: new Date().toISOString(),
      estado: payload.estado
    };
    Swal.fire({
      icon: 'question',
      title: '¿Esta seguro que desea guardar la tarifa especial para la ciudad ' + (this.data.flag === 1 ? this.data.dataEditar.nombreCiudad : payload.ciudad.nombreCiudad) + ' y el punto ' + (this.data.flag === 1 ? this.data.dataEditar.nombrePunto : payload.punto.nombrePunto),
      showCancelButton: true,
      confirmButtonText: 'GUARDAR',
      cancelButtonText: 'CANCELAR'
    }).then(result => {
      if (result.isConfirmed) {
        if (this.data.flag === 1) {
          this.tarifasEspecialesService.editarTarifaEspecialesPunto(tarifaEspecial).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                text: 'Registro editado correctamente'
              }).then(result => {
                this.dialogRef.close(this.form.value);
              });
            },
            error: (err) => {
              const desc = err?.error?.response?.description;
              if (desc) {
                const mensajes = desc.split('|').map(m => {
                  let texto = m.trim();
                  for (const key in fieldLabels) {
                    if (texto.startsWith(key + ':')) {
                      texto = texto.replace(key + ':', fieldLabels[key] + ':');
                    }
                  }
                  return texto;
                });
                const listaHtml = `<ul style="text-align:left">${mensajes.map(m => `<li>${this.escapeHtml(m)}</li><br>`).join('')}</ul>`;
                Swal.fire({
                  icon: 'error',
                  title: 'Errores de validación',
                  html: listaHtml
                });
              }
            }
          });
        } else {
          this.tarifasEspecialesService.guardarTarifaEspecialesPunto(tarifaEspecial).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                text: 'Tarifa creada exitosamente'
              }).then(result => {
                this.dialogRef.close(this.form.value);
              });
            },
            error: (err) => {
              const desc = err?.error?.response?.description;
              if (desc) {
                const mensajes = desc.split('|').map(m => {
                  let texto = m.trim();
                  for (const key in fieldLabels) {
                    if (texto.startsWith(key + ':')) {
                      texto = texto.replace(key + ':', fieldLabels[key] + ':');
                    }
                  }
                  return texto;
                });
                const listaHtml = `<ul style="text-align:left">${mensajes.map(m => `<li>${this.escapeHtml(m)}</li><br>`).join('')}</ul>`;
                Swal.fire({
                  icon: 'error',
                  title: 'Errores de validación',
                  html: listaHtml
                });
              }
            }
          });
        }
      }
    });
  }

  setDatosFormulario(data: any) {
    this.form.patchValue({
      fechaInicio: this.parseLocalDate(data.fechaInicioVigencia),
      fechaFin: this.parseLocalDate(data.fechaFinVigencia),
      transportadora: this.transportadorasList.find(t => t.nombreTransportadora === data.nombreTransportadora),
      ciudad: data.nombreCiudad === 'TODAS' ? this.ciudadesList.find(c => c.codigoNombreCiudad === data.nombreCiudad) : this.ciudadesList.find(c => c.nombreCiudad === data.nombreCiudad),
      punto: data.nombreCiudad === 'TODAS' ? this.onCiudadChange(this.ciudadesList.find(c => c.codigoNombreCiudad === data.nombreCiudad))[0] : this.onCiudadChange(this.ciudadesList.find(c => c.nombreCiudad === data.nombreCiudad)).find(p => p.codigoPunto === data.codigoPunto),
      tipoOperacion: this.tipoOperacionesList.find(o => o === data.tipoOperacion),
      tipoComision: this.tipoComisionList.find(tc => tc === data.tipoComision),
      tipoServicio: this.tipoServiciosList.find(ts => ts === data.tipoServicio),
      escala: this.escalaList.find(e => e === data.escala),
      unidadCobro: data.unidadCobro,
      limiteComision: data.limiteComisionAplicar,
      valorComisionAdicional: data.valorComisionAdicional,
      valorTarifa: data.valorTarifa,
      estado: data.estado,
      escalas: data.escala === 'SI',
      billetes: data.billetes === 'SI',
      monedas: data.monedas === 'SI',
      fajado: data.fajado === 'SI',
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  parseLocalDate(dateStr: string): Date {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d); // mes 0-index
  }

  aplicarReglasEdicion(modo: 'EDICION_COMPLETA' | 'EDICION_PARCIAL' | 'NO_EDITABLE') {
    const reglasEdicion = {
      EDICION_COMPLETA: [
        'fechaInicio', 'fechaFin',
        'valorTarifa', 'limiteComision', 'valorComisionAdicional',
        'estado', 'billetes', 'monedas', 'fajado'
      ],
      EDICION_PARCIAL: [
        'fechaFin'
      ],
      NO_EDITABLE: [] // todos deshabilitados
    };
    const todos = Object.keys(this.form.controls);
    const habilitados = reglasEdicion[modo];

    todos.forEach(campo => {
      const control = this.form.get(campo);
      if (!control) return;

      if (habilitados.includes(campo)) {
        control.enable({ emitEvent: false });
      } else {
        control.disable({ emitEvent: false });
      }
    });
  }

  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
}
