import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-form-clientes-corp',
  templateUrl: './form-clientes-corp.component.html',
  styleUrls: ['./form-clientes-corp.component.css']
})
export class FormClientesCorpComponent implements OnInit {

  form: FormGroup;
  bancos: any[] = [];
  checkAmparado: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<FormClientesCorpComponent>
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
    this.initForm(this.data);
  }

  initForm(param?: any) {
    debugger;
    if (!(param === null || param === undefined)) {
      this.bancos = param.bancos;
      let banco = param.row?.codigoBancoAval != null ? this.bancos.find((value) => value.codigoPunto == param.row.codigoBancoAval) : [];
      this.form = new FormGroup({
        'codigoCliente': new FormControl({value: param.row?.codigoCliente, disabled: true}),
        'codigoBancoAval': new FormControl( param.row != null ? banco : null),
        'nombreCliente': new FormControl(param.row != null ? param.row.nombreCliente : null),
        'tipoId': new FormControl(param.row != null ? param.row.tipoId : null),
        'identificacion': new FormControl(param.row != null ? param.row.identificacion : null),
        'tarifaSeparacion': new FormControl(param.row != null ? param.row.tarifaSeparacion : null),
      });
      this.checkAmparado = param.row != null ? param.row.amparado : false
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }

}
