import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from 'src/app/_service/administracion-service/menu.service';
import { FormMenuComponent } from '../form-menu/form-menu.component';
import { Menu } from 'src/app/_model/menu';

@Component({
    selector: 'app-list-menu',
    templateUrl: './list-menu.component.html'
})
export class ListMenuComponent implements OnInit {

    displayedColumns: string[] = ['id', 'idMenuPadre', 'nombre', 'tipo', 'icono', 'url', 'estado', 'acciones'];
    dataSourceMenu: MatTableDataSource<Menu>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private readonly menuService: MenuService,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.listarMenus();
    }

    listarMenus() {
        this.menuService.listarMenus().subscribe(response => {
            this.dataSourceMenu = new MatTableDataSource(response.data);
            this.dataSourceMenu.paginator = this.paginator;
            this.dataSourceMenu.sort = this.sort;
        });
    }

    openForm(menu?: Menu) {
        const dialogRef = this.dialog.open(FormMenuComponent, {
            width: '500px',
            data: menu
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.listarMenus();
            }
        });
    }

    eliminarMenu(id: number) {
        this.menuService.deleteMenu(id).subscribe(() => {
            this.listarMenus();
        });
    }
}