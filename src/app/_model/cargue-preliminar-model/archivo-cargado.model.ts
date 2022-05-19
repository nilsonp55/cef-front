import { RegistroArchivoModel } from "./registro-archivo.model"

/** 
 * Modelo para contener la información del archivo del cargue preliminar
 * @BaironPerez
*/
export class ArchivoCargadoModel {
    idArchivo: number;
    fechaInicioCargue: Date;
    estadoCargue: string;
    nombreArchivo: string;
    fechaArchivo: Date;
    fechaFinCargue: Date;
    numeroRegistros: number;
    vigencia: string;
    idModeloArchivo: string;
    estado: string;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
    registrosCargadosDto: RegistroArchivoModel[];
}
