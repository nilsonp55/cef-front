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

  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  ngOnInit(): void {
    this.initForm(this.registro);
  }

  initForm(param?: any) {
    this.form = new FormGroup({
      'idTarifasOperacion': new FormControl({value: param ? param.idTarifasOperacion : null, disabled: true,}),
      'bancoAval': new FormControl(param ? param.bancoAval : null),
      'tipoOperacion': new FormControl(param ? param.tipoOperacion : null),
      'tipoServicio': new FormControl(param ? param.tipoServicio : null),
      'escala': new FormControl(param ? param.escala : null),
      'comisionAplicar': new FormControl(param ? param.comisionAplicar : null),
      'valorTarifa': new FormControl(param ? param.valorTarifa : null),
      'billetes': new FormControl(param ? param.billetes : null),
      'monedas': new FormControl(param ? param.monedas : null),
      'fajado': new FormControl(param ? param.fajado : null),
      'transportadora': new FormControl(param ? param.transportadora : null),
      'estado': new FormControl(param ? param.estado : null),
      'fechaVigenciaIni': new FormControl(param ? param.fechaVigenciaIni : null),
      'fechaVigenciaFin': new FormControl(param ? param.fechaVigenciaFin : null),
    });
  }

  onGuardar() {
    if (this.form.valid) {
      this.guardar.emit(this.form.value);
    }
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
