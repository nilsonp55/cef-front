/**
* Modelo para contener la información de las operaciones certificadas no conciliadas
* @JuanMazo
*/
export class ConciliacionesCertificadaNoConciliadasModel {
    
    idCertificacion: string;
    codigoFondoTDV: number;
    codigoBanco: number;
    codigoCiudad: number;
    codigoPuntoOrigen: number;
    codigoPuntoDestino: number;
    tipoPuntoOrigen: string;
    tipoPuntoDestino: string;
    fechaEjecucion: string;
    tipoOperacion: string;
    tipoServicio: string;
    estadoConciliacion: string;
    conciliable: string;
    valorTotal: number;
    valorFaltante: number;
    valorSobrante: number;
    fallidaOficina: string;
    usuarioCreacion: string;
    usuarioModificacion: string;
    fechaCreacion: string;
    fechaModificacion: string;
    bancoAVAL: string;
    tdv: string;
}