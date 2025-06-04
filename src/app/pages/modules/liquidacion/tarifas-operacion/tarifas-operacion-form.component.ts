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
      'idTarifasOperacion': new FormControl({value: param ? param.idTarifasOperacion : null, disabled: true,}),
      'bancoAval': new FormControl(this.bancos.find(e => e.codigoPunto === param?.bancoDTO?.codigoPunto) ?? null),
      'tipoOperacion': new FormControl(param?.tipoOperacion ?? null),
      'tipoServicio': new FormControl(param?.tipoServicio ?? null),
      'escala': new FormControl(this.escalas.find(e => e === param?.escala ) ?? null),
      'comisionAplicar': new FormControl(param?.comisionAplicar ?? null),
      'valorTarifa': new FormControl(param?.valorTarifa ?? null),
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
      this.guardar.emit(this.form.value);
    }
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
