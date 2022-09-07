import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';

/**
 * @JuanMazo
 * Clase Mat Dialog que nos permite confirmar una desconciliacion
 */
@Component({
  selector: 'app-dialog-desconciliar',
  templateUrl: './dialog-desconciliar.component.html',
  styleUrls: ['./dialog-desconciliar.component.css']
})

/**
 * @JuanMazo
 * Clase Mat Dialog que nos permite confirmar una desconciliacion
 */
export class DialogDesconciliarComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;
  objCErtificado: any;
  seleccionDescon: any;
  idConciliacionList: any[];

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['codigoFondoTDV', 'entradaSalida', 'tipoPuntoOrigen', 'codigoPuntoOrigen', 'tipoPuntoDestino', 'codigoPuntoDestino', 'fechaProgramacion', 'fechaOrigen', 'fechaDestino', 'tipoOperacion', 'tipoTransporte', 'valorTotal', 'estadoOperacion', 'idNegociacion', 'tasaNegociacion', 'estadoConciliacion', 'idOperacionRelac', 'tipoServicio'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDesconciliarComponent>,
    private opConciliadasService: OpConciliadasService) {
    this.objCErtificado = data;
  }

  ngOnInit(): void {}

  /**
   * Función que nos permite consumir el servicio para desconciliar enrtregandole el "id" de la operación 
   */
  desconciliar() {
    this.opConciliadasService.desconciliar(this.objCErtificado.seleccionDescon.idConciliacion).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.dialogRef.close({event:"load",data:{"event":"load"}});
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  close(){
    this.dialogRef.close({event:'Cancel'})
  }
  
}