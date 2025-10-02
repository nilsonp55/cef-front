import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from 'src/app/_service/administracion-service/menu.service';
import { FormMenuComponent } from '../form-menu/form-menu.component';
import { Menu } from 'src/app/_model/menu';

@Component({
  selector: 'app-lista-menu',
  templateUrl: './lista-menu.component.html'
})
export class ListaMenuComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'icono', 'url', 'acciones'];
  dataSource: MatTableDataSource<Menu>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private menuService: MenuService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarMenus();
  }

  listarMenus() {
    this.menuService.listarMenus().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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