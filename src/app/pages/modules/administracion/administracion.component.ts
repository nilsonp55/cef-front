import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})

/**
 * Clase que contiene todas las pestañas de administración
 * @BayronPerez
 */
export class AdministracionComponent implements OnInit {

  checkMenuLateral: boolean;
  menusAdministracion: any[] = [];
  menusAdministracionTablsContables: any[] = [];


  constructor(
    private rolMenuService: RolMenuService,
  ) { }

  ngOnInit(): void {
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': atob(sessionStorage.getItem('user'))
    }).subscribe(data => {
      //Logica para capturar los menus para administracion
      let rol = data.data[0].rol.idRol;
      this.rolMenuService.obtenerMenuRol({
        'rol.idRol': rol,
        'estado': "1",
        'menu.idMenuPadre': "administracion"
      }).subscribe(menusrol => {
        menusrol.data.forEach(itm => {
          this.menusAdministracion.push(itm.menu);
        });
      });
      //Logica para capturar los menus para administracion tablas contables
      this.rolMenuService.obtenerMenuRol({
        'rol.idRol': rol,
        'estado': "1",
        'menu.idMenuPadre': "administracionTabContables"
      }).subscribe(menusrol => {
        menusrol.data.forEach(itm => {
          this.menusAdministracionTablsContables.push(itm.menu);
        });
      });
    })
  }

  /**
   * Metodo encargado de obtener el valor del check del Baner-Superior 
   * para cerrar o abrir  la barra lateral izquierda
   * @BayronPerez
   */
   onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }

  }

}
