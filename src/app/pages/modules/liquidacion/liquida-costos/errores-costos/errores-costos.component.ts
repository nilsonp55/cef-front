import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { ResultadoValoresLiquidadosComponent } from '../resultado-valores-liquidados/resultado-valores-liquidados.component';


@Component({
  selector: 'app-errores-costos',
  templateUrl: './errores-costos.component.html',
  styleUrls: ['./errores-costos.component.css']
})
export class ErroresCostosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  titulo: any;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['fecha', 'menaje_error', 'seqGrupo',
      'estado'];

  constructor(
    private dialog: MatDialog,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private dialogRef: MatDialogRef<ResultadoValoresLiquidadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {respuesta: any, titulo: any}
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.titulo = this.data.titulo
    this.dataSourceInfoProcesos = new MatTableDataSource(this.data.respuesta);
    this.dataSourceInfoProcesos.sort = this.sort;
  }

  close(){
    this.dialogRef.close({event:'Cancel'})
  }

  
}
