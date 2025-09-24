import { MatPaginatorIntl } from "@angular/material/paginator";

export function getSpanishPaginatorIntl(): MatPaginatorIntl {
    const paginatorIntl = new MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = 'Elementos por página:'
    
    const originalGetRangeLabel = paginatorIntl.getRangeLabel;
    paginatorIntl.getRangeLabel = (page: number, pagesize: number, length: number)=>{
        const originalLabel = originalGetRangeLabel(page, pagesize, length)
        return originalLabel.replace(' of ',' de ');
    }
    return paginatorIntl;
}