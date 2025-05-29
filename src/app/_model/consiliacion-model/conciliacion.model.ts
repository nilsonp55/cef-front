/**
* Modelo para contener la información del archivo
* @JuanMazo
*/
export class ConciliacionesModel {

   banco: string;
   transPortadora: string;
   ciudad: string;
   tipoOperacion: string;
   nombrePuntoOrigen: string;
   nombrePuntoDestino: string;
   ciudadPuntoOrigen: string;
   ciudadPuntoDestino: string;
   valor: number;
   tipoConciliacion: string;
   fechaEjecucion: Date;
}