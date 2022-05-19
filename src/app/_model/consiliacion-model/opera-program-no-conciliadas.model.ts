/**
* Modelo para contener la información de las operaciones no conciliadas
* @JuanMazo
*/
export class ConciliacionesProgramadasNoConciliadasModel {

    idOperacion: number;
    codigoFondoTDV: number;
    entradaSalida: string;
    tipoPuntoOrigen: string;
    codigoPuntoOrigen: number;
    tipoPuntoDestino: string;
    codigoPuntoDestino: number;
    fechaProgramacion: string;
    fechaOrigen: string;
    fechaDestino: string;
    tipoOperacion: string;
    tipoTransporte: string;
    valorTotal: string;
    estadoOperacion: string;
    idNegociacion: number;
    tasaNegociacion: string;
    estadoConciliacion: string;
    idArchivoCargado: number;
    idOperacionRelac: number;
    tipoServicio: string;
    usuarioCreacion: string;
    usuarioModificacion: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
}