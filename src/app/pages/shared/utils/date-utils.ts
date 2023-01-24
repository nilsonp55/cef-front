import { DatePipe } from "@angular/common";
import { GENERALES } from "../constantes";

/**
 * Utilidad para realizar formato de fechas en la aplicación
 * @BaironPerez
 */
export class DateUtil {

    //constructor(private datePipe: DatePipe) {}

    /**
     * Metodo encargado de transformar una Fecha de tipo Date a String
     * @param fecha 
     * @param format 
     * @returns: fecha tipo FECHA_PATTERN2: String
     */
    public static dateToString(fecha: Date, format: string = GENERALES.FECHA_PATTERN2) {
        if (fecha === null || fecha === undefined) {
            return null;
        }
        const pipe = new DatePipe('es-CO'); //en-US
        return pipe.transform(fecha, format);
    }


    /**
     * Metodo encargado de transformar una Fecha de tipo String a Date
     * @param fecha 
     * @returns: Fecha tipo Date
     */
    public static stringToDate(fecha: string) {
        if (!fecha) {
            return undefined;
        }
        const res: any = fecha.indexOf('-') !== -1 ? fecha.split('-') : fecha.split('/');
        const dia: number = res[0];
        const mes: number = res[1] - 1;
        const anio: number = res[2];

        return new Date(anio, mes, dia);
    }

 

    
}