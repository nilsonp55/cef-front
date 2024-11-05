import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { OpConciliadasService } from "src/app/_service/conciliacion-service/op-conciliadas.service";

@Component({
    selector: 'app-dialog-update-estado-operaciones',
    templateUrl: './dialog-update-estado-operaciones.component.html',
    styleUrls: ['./dialog-update-estado-operaciones.component.css']
})

/**
 * @prv_nparra
 */
export class DialogUpdateEstadoOperacionesComponent implements OnInit {

    form: FormGroup;
    dataOperaciones: any;
    operacion: string;

    estadosOperacion: any[] = [
        { value: 'cancelada-1', viewValue: 'CANCELADA' },
        { value: 'no_conciliado-2', viewValue: 'NO_CONCILIADA' },
        { value: 'fallida-3', viewValue: 'FALLIDA' },
        { value: 'pospuesta-4', viewValue: 'POSPUESTA' },
        { value: 'fuera_de_conciliacion-4', viewValue: 'FUERA_DE_CONCILIACION' },
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { listOperaciones: any, operacion: string },
        private opConciliadasService: OpConciliadasService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogUpdateEstadoOperacionesComponent>
    ) { }

    ngOnInit(): void {
        this.dataOperaciones = this.data.listOperaciones;
        this.operacion = this.data.operacion;
        this.form = new FormGroup({});
    }

    actualizarOperaciones() {

    }

    onCancel(): void {
        this.dialogRef.close();
    }
}