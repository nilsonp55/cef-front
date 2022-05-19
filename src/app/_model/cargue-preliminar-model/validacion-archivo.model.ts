import { ValidacionLineaArchivo } from "./validacion-linea-archivo.model";

/** 
 * Modelo para contener la información de la validacion del archivo en el cargue preliminar
 * @BaironPerez
*/
export class ValidacionArchivo {
    nombreArchivo: string;
    descripcion: string;
    numeroRegistros: number;
    numeroErrores: number;
    estadoValidacion: string;
    fechaArchivo: Date;
    validacionLineas: ValidacionLineaArchivo[];
}