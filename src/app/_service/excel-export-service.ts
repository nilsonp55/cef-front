import { Injectable } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { DataExtractorService } from "mat-table-exporter";
import * as XLSX from 'xlsx';
import { GENERALES } from "../pages/shared/constantes";

export interface NumericColumnConfig {
    /**Nombre de la columna (debe coincidir con displayedColumns) */
    columnName: string;
    /** Formato númerico ej: '#,##0.00'*/
    format?: string;
}

export interface ExcelExportOption {
    fileName: string;
    sheetName?: string;
    data: MatTable<any>;
    /** Columnas a Exportar (usar displayedColumns)*/
    columns: string[]
    /** Especificar solo columnas numéricas*/
    numericColumns?: NumericColumnConfig[];
}

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {

    constructor(
        private readonly dataExtractor: DataExtractorService
    ) { }

    exportToExcel(options: ExcelExportOption): void {
        let data = this.extratMatTableData(options);
        const [columnsValueNumber, columnsFormat] = this.getColumnsFormat(options);
        let mappedData: any[] = this.processData(data, options, columnsValueNumber);
        this.createExcelFile(mappedData, options, columnsValueNumber, columnsFormat);
    }

    private processData(data: any[], options: ExcelExportOption, columnsValueNumber: any[]): any[] {
        return data.map(item => {
            const row: any = {};
            for (let i = 0; i < options.columns.length; i++) {
                let columnNameKey = options.columns[i].replace(/([A-Z])/g, ' $1').toUpperCase();
                if (columnsValueNumber.includes(i)) {
                    row[columnNameKey] = this.parseCurrencyToFloat(item[i]);
                } else {
                    row[columnNameKey] = item[i];
                }
            }
            return row;
        });
    }

    parseCurrencyToFloat(value: any): number {
        let isCurrency = /[^\d.,-]/.test(value.toString());
        if (isCurrency) {
            return parseFloat(value.replace(/[^0-9,]+/g, '').replace(',', '.'));
        }
        return parseFloat(value.replace(',', '.'));
    }

    private getColumnsFormat(options: ExcelExportOption): any[] {
        let columnsValueNumber = [];
        let columnsFormat = [];
        if (options.numericColumns && options.numericColumns.length > 0) {
            options.numericColumns.forEach(numCol => {
                const colIndex = options.columns.indexOf(numCol.columnName);
                if (colIndex !== -1) {
                    columnsValueNumber.push(colIndex);
                    columnsFormat.push(numCol.format || GENERALES.FORMATS_EXCEL.NUMBERS.FORMAT1);
                }
            });
        }
        return [columnsValueNumber, columnsFormat];
    }

    private createExcelFile(mappedData: any, options: ExcelExportOption, columnsValueNumber: any[], columnsFormat: any[]) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
        if (columnsValueNumber.length > 0) {
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let i = 0; i < columnsValueNumber.length; i++) {
                const colmnLetter = this.getColumnLetter(columnsValueNumber[i]);
                const format = columnsFormat[i]
                for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
                    const cellAddress = colmnLetter + (rowNum + 1);
                    if (ws[cellAddress]) {
                        ws[cellAddress].t = 'n';
                        ws[cellAddress].v = Number(ws[cellAddress].v);
                        ws[cellAddress].z = format;
                    }
                }
            }
        }
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, options.sheetName);
        XLSX.writeFile(wb, `${options.fileName}.xlsx`);
    }

    private getColumnLetter(index: number): string {
        let letter = '';
        while (index >= 0) {
            letter = String.fromCharCode((index % 26) + 65) + letter;
            index = Math.floor(index / 26) - 1;
        }
        return letter;
    }

    extratMatTableData(options: ExcelExportOption) {
        return this.dataExtractor.extractRows(options.data, options.columns);
    }
}