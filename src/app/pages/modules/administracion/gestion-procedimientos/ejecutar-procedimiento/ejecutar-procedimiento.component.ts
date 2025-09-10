import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ProcedimientosAlmacenadosService } from 'src/app/_service/administracion-service/procedimientos-almacenados.service';
import { MatTableDataSource } from '@angular/material/table';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-ejecutar-procedimiento',
  templateUrl: './ejecutar-procedimiento.component.html',
  styleUrls: ['./ejecutar-procedimiento.component.css']
})
export class EjecutarProcedimientoComponent implements OnInit {

  public nombreParametro: any;
  public tipoDatoParametro: any;
  public posiblesValores: any;
  public funcionesDinamicasDTO: any;
  public concatString: string = '';
  public parametrosFuncionesDinamicasDTO: any[] = [];
  public idFuncion: any;
  spinnerActive: boolean = false;
  dataSourceResponse: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6', 'campo7', 'campo8', 'campo9', 'campo10', 'campo11', 'campo12'];
  mostrarTabla: boolean = false;
  nameFuntion: string = '';
  descriptionFuntion: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {funcion:any, data: any, nameFuntion: any, descriptionFuntion: any},
    private readonly procedimientosAlmacenadosService: ProcedimientosAlmacenadosService,
    public dialogRef: MatDialogRef<EjecutarProcedimientoComponent>,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
    this.parametrosFuncionesDinamicasDTO = this.data.data.sort((a, b) => a.numeroParametro - b.numeroParametro);
    this.idFuncion = this.data.funcion;
    this.nameFuntion = this.data.nameFuntion;
    this.descriptionFuntion = this.data.descriptionFuntion;
  } 

  changeValor(param: any, item: any) {
    this.parametrosFuncionesDinamicasDTO.find(e => e.idParametro === item.idParametro)["valorDefecto"] = param.target.value;
  }

  /**
   * Metodo encargado de ejecutar el procedimiento almacenado
   * BayronPerez
   */
  ejecutar() {
    let parametrosFuncion = '';
    this.parametrosFuncionesDinamicasDTO.forEach(e => parametrosFuncion += e.valorDefecto + ',');
    parametrosFuncion = parametrosFuncion.substring(0, parametrosFuncion.length-1);
    const body ={
      "idFuncion": this.idFuncion,
      "parametros": parametrosFuncion
    }
    this.procedimientosAlmacenadosService.guardarProcedimientos(body).subscribe({next: data => {
      this.spinnerActive = false;
      let listResponse: any[]= [];
      data.data.forEach(item => {
        if(item !== null){
          let resp = item.split(',');
          if(resp.length == 1){
            const object = {
              campo1: resp[0],
            }
            listResponse.push(object);
          }
          if(resp.length == 2){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
            }
            listResponse.push(object);
          }
          if(resp.length == 3){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2]
            }
            listResponse.push(object);
          }
          if(resp.length == 4){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3]
            }
            listResponse.push(object);
          }
          if(resp.length == 5){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4]
            }
            listResponse.push(object);
          }
          if(resp.length == 6){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4],
              campo6: resp[5]
            }
            listResponse.push(object);
          }
          if(resp.length == 7){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4],
              campo6: resp[5],
              campo7: resp[6]
            }
            listResponse.push(object);
          }
          if(resp.length == 8){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4],
              campo6: resp[5],
              campo7: resp[6],
              campo8: resp[7],
            }
            listResponse.push(object);
          }
          if(resp.length == 9){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4],
              campo6: resp[5],
              campo7: resp[6],
              campo8: resp[7],
              campo9: resp[8]
            }
            listResponse.push(object);
          }
          if(resp.length == 10){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4],
              campo6: resp[5],
              campo7: resp[6],
              campo8: resp[7],
              campo9: resp[8],
              campo10: resp[9],
            }
            listResponse.push(object);
          }
          if(resp.length == 11){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4],
              campo6: resp[5],
              campo7: resp[6],
              campo8: resp[7],
              campo9: resp[8],
              campo10: resp[9],
              campo11: resp[10],
            }
            listResponse.push(object);
          }
          if(resp.length == 12){
            const object = {
              campo1: resp[0],
              campo2: resp[1],
              campo3: resp[2],
              campo4: resp[3],
              campo5: resp[4],
              campo6: resp[5],
              campo7: resp[6],
              campo8: resp[7],
              campo9: resp[8],
              campo10: resp[9],
              campo11: resp[10],
              campo12: resp[11],
            }
            listResponse.push(object);
          }
        }
      });
      this.dataSourceResponse = new MatTableDataSource(listResponse);
      this.mostrarTabla = true;

      this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Se ejecuto el procedimiento almacenado',
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      });
    },
    error: (err: any) => {
        this.spinnerActive = false;
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al ejecutar el procedimiento almacenado',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })

  }
  
}

