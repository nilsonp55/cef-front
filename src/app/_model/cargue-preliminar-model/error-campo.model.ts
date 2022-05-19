/** 
 * Modelo para contener la información de error de un campo en el archivo en el cargue preliminar
 * @BaironPerez
*/
export class ErroresCampos {
    numeroLinea: number;
    numeroCampo: number;
    contenido: string;
    estado: string;
    codigoError: number[];
    mensajeError: string[];
}