import { ErroresCampos } from "./error-campo.model";

/** 
 * Modelo para contener la información de la validacion de la linea del archivo en el cargue preliminar
 * @BaironPerez
*/
export class ValidacionLineaArchivo {
    numeroLinea: number;
    contenidoTxt: string;
    estado: string;
    tipoRegistro: number;
    contenido: string[];
    campos: ErroresCampos[];
}