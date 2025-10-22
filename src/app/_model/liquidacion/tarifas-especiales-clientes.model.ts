/**
* Modelo para contener la información de tarifas especiales clientes
* @hector.mercado
*/
export class TarifasEspecialesClientesModel {

    idTarifaEspecial: number;
    codigoPuntoTarifaEspecial: number;
	tipoOperacionTarifaEspecial: string;
	tipoServicioTarifaEspecial: string;
	tipoComisionTarifaEspecial: string;
	unidadCobroTarifaEspecial: string;
	valorComisionTarifaEspecial: number;
	fechaInicioVigenciaTarifaEspecial: Date;
	fechaFinVigenciaTarifaEspecial: Date;
    estadoTaridaEspecial: number;
	usuarioCreacionTarifaEspecial: string;
	fechaCreacionTarifaEspecial: Date;
    usuarioModificacionTarifaEspecial: string;
	fechaModificacionTarifaEspecial: Date;

 }