import { isEmpty } from "rxjs";

export class ManejoFechaToken {

    static flagVencimiento: boolean = false;

    constructor() { }

    public static manejoFechaToken() {
        var fechaMiliseguntos = new Date().getTime()/1000.0;
        var fechaTokenExp = Number(sessionStorage.getItem('time_token_exp'))
        if(fechaTokenExp == undefined || fechaTokenExp == null){
            window.location.href = '/final-session'
        }else {
            this.advertenciaTiempo(fechaMiliseguntos, fechaTokenExp)
            this.validacionFechasToken(fechaMiliseguntos, fechaTokenExp)
        }

    }

    public static validacionFechasToken(fechaLocal: any, fechaToken: any) {
        if (fechaLocal == fechaToken || fechaLocal > fechaToken) {
            console.log("Su session a terminado")
            window.location.href = '/final-session'
        }else {
            console.log("La session sigue activa")
        }
        
    }

    static advertenciaTiempo(fechaActual: any, fechaExpToken: any){debugger
        var fechaAdvertencia = fechaExpToken - 300
        if(fechaActual > fechaAdvertencia && fechaActual < fechaExpToken && !this.flagVencimiento){
            alert("Su sesion va a terminar en menos de 5 minutos")
            this.flagVencimiento = true
        }else {
            console.log("La session sigue como si nada")
        }
        
      }
}