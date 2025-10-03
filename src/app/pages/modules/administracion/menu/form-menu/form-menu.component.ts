import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/administracion-service/menu.service';

@Component({
    selector: 'app-form-menu',
    templateUrl: './form-menu.component.html'
})
export class FormMenuComponent implements OnInit {

    form: FormGroup;
    isEdit: boolean;

    constructor(
        public dialogRef: MatDialogRef<FormMenuComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Menu,
        private fb: FormBuilder,
        private menuService: MenuService
    ) { }

    ngOnInit(): void {
        this.isEdit = this.data ? true : false;
        this.form = this.fb.group({
            idMenu: [this.data ? this.data.idMenu : ''],
            idMenuPadre: [this.data ? this.data.idMenuPadre : null],
            nombre: [this.data ? this.data.nombre : '', Validators.required],
            tipo: [this.data ? this.data.tipo : null],
            icono: [this.data ? this.data.icono : '', Validators.required],
            url: [this.data ? this.data.url : '', Validators.required],
            estado: [this.data ? this.data.estado : null],
        });
    }

    guardar() {
        if (this.form.invalid) {
            return;
        }

        const menu = this.form.value;

        if (this.isEdit) {
            this.menuService.updateMenu(menu).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.menuService.createMenu(menu).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}