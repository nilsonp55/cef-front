import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ProcedimientosAlmacenadosService } from 'src/app/_service/administracion-service/procedimientos-almacenados.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ejecutar-procedimiento',
  templateUrl: './ejecutar-procedimiento.component.html',
  styleUrls: ['./ejecutar-procedimiento.component.css']
})
export class EjecutarProcedimientoComponent implements OnInit {

  public nombreParametro: any;
  public tipoDatoParametro: any;
  valorDefecto: string = '';
  public posiblesValores: any;
  public funcionesDinamicasDTO: any;
  public concatString: string = '';
  public parametrosFuncionesDinamicasDTO: any[] = [];
  public idFuncion: any;
  spinnerActive: boolean = false;
  dataSourceResponse: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['campo1', 'campo2', 'campo3'];
  mostrarTabla: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {funcion:any, data: any},
    private procedimientosAlmacenadosService: ProcedimientosAlmacenadosService,
    public dialogRef: MatDialogRef<EjecutarProcedimientoComponent>,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.parametrosFuncionesDinamicasDTO = this.data.data;
    this.idFuncion = this.data.funcion;
    console.log();
  }

  confirmValor(idCampo, idBoton, valordefectoParam) {
    //this.concatString += this.valorDefecto + ',';
    let valor = document.getElementById(idCampo);
    if(this.valorDefecto !== ""){
      this.concatString += this.valorDefecto + ',';
    } else {
      this.concatString += valordefectoParam + ',';
    }
    valor.setAttribute('disabled', '');
    const boton = document.getElementById(idBoton);
    boton.setAttribute('disabled', '');
    boton.innerHTML = 'Confirmado';
  }
  

  changeValor(param) {
    this.valorDefecto = ""; 
    this.valorDefecto += param.target.value;
  }

  /**
   * Metodo encargado de ejecutar el procedimiento almacenado
   * BayronPerez
   */
  ejecutar() {
    let formato = this.concatString.substr(0,this.concatString.length -1)
    const body ={
      "idFuncion": this.idFuncion,
      "parametros": formato
    }
    this.procedimientosAlmacenadosService.guardarProcedimientos(body).subscribe(data => {
      this.spinnerActive = false;
      let listResponse: any[]= [];
      data.data.forEach(item => {
        let c1;
        let c2;
        let c3;
        if(item !== null){
          let resp = item.split(',');
          const object = {
            campo1:  resp[0],
            campo2: resp[1],
            campo3: resp[2]
          }
          listResponse.push(object);
        }
        
      });
      this.dataSourceResponse = new MatTableDataSource(listResponse);
      this.mostrarTabla = true;

      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Se ejecuto el procedimiento almacenado',
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
    },
      (err: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al ejecutar el procedimiento almacenado',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.dialogRef.close();
      })

  }
}

