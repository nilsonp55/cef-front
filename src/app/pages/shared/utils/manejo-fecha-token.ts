export class ManejoFechaToken {

    constructor() { }

    public static manejoFechaToken() {
        var fechaMiliseguntos = new Date().getTime()/1000.0;
        var fechaTokenExp = Number(sessionStorage.getItem('time_token_exp'))
        this.advertenciaTiempo(fechaMiliseguntos, fechaTokenExp)
        this.validacionFechasToken(fechaMiliseguntos, fechaTokenExp)
    }

    public static validacionFechasToken(fechaLocal: any, fechaToken: any) {
        if (fechaLocal == fechaToken || fechaLocal > fechaToken) {
            console.log("Su session a terminado")
            window.location.href = '/final-session'
        }else {
            console.log("La session sigue activa")
        }
        
    }

    static advertenciaTiempo(fechaActual: any, fechaExpToken: any){
        var fechaAdvertencia = fechaExpToken - 300
        if(fechaActual > fechaAdvertencia && fechaActual < fechaExpToken){
            console.log("Mopstrar aviso de popup")
            alert("Su sesion va a morir en menos de 5 minutos")
        }else {
            console.log("La session sigue como si nada")
        }
        
      }
}