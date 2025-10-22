import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tarifas-operacion-form',
  templateUrl: './tarifas-operacion-form.component.html',
  styleUrls: ['./tarifas-operacion.component.css']
})
export class TarifasOperacionFormComponent implements OnInit {

  @Input() registro: any;
  @Input() bancos: any[] = [];
  @Input() transportadoras: any[] = [];
  @Input() tipoOperaciones: any[] = [];
  @Input() tipoServicios: any[] = [];
  @Input() escalas: any[] = [];
  @Input() comisionesAplicar: any[] = [];
  @Input() tiposPuntos: any;

  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  ngOnInit(): void {
    this.initForm(this.registro);
  }

  initForm(param?: any) {
    this.form = new FormGroup({
      'idTarifasOperacion': new FormControl({ value: param ? param.idTarifasOperacion : null, disabled: true, }),
      'bancoAval': new FormControl(this.bancos.find(e => e.codigoPunto === param?.bancoDTO?.codigoPunto) ?? null),
      'tipoOperacion': new FormControl(param?.tipoOperacion ?? null),
      'tipoServicio': new FormControl(param?.tipoServicio ?? null),
      'escala': new FormControl(this.escalas.find(e => e === param?.escala) ?? null),
      'comisionAplicar': new FormControl(param?.comisionAplicar ?? null),
      'valorTarifa': new FormControl(param?.valorTarifa ?? null),
      'limiteComisionAplicar': new FormControl(param?.limiteComisionAplicar ?? null),
      'valorComisionAdicional': new FormControl(param?.valorComisionAdicional ?? null),
      'billetes': new FormControl(param?.billetes ?? null),
      'monedas': new FormControl(param?.monedas ?? null),
      'fajado': new FormControl(param?.fajado ?? null),
      'transportadora': new FormControl(this.transportadoras.find(e => e.codigo === param?.transportadoraDTO.codigo) ?? null),
      'estado': new FormControl(param?.estado ?? 1),
      'fechaVigenciaIni': new FormControl(param?.fechaVigenciaIni ?? null),
      'fechaVigenciaFin': new FormControl(param?.fechaVigenciaFin ?? null),
      'tipoPunto': new FormControl(this.tiposPuntos.find(e => e === param?.tipoPunto) ?? null),
    });
  }

  onGuardar() {
    if (this.form.valid) {
      this.guardar.emit(this.form);
    }
  }

  onCancelar() {
    this.cancelar.emit();
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
}
