import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';

@Component({
  selector: 'app-resultado-valores-liquidados',
  templateUrl: './resultado-valores-liquidados.component.html',
  styleUrls: ['./resultado-valores-liquidados.component.css']
})
export class ResultadoValoresLiquidadosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  titulo: any;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['clasificacionFajado', 'clasificacionNoFajado', 'costoCharter',
      'costoEmisario', 'costoFijoParado', 'costoMoneda', 'costoPaqueteo', 'idLiquidacion',
      'milajePorRuteo', 'milajeVerificacion', 'modenaResiduo', 'tasaAeroportuaria', 'idSeqGrupo'];

  constructor(
    private dialog: MatDialog,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private dialogRef: MatDialogRef<ResultadoValoresLiquidadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {respuesta: any, titulo: any}
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo
    this.dataSourceInfoProcesos = new MatTableDataSource(this.data.respuesta);
    this.dataSourceInfoProcesos.sort = this.sort;
  }

  close(){
    this.dialogRef.close({event:'Cancel'})
  }

}
