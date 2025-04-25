import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html'
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
    private readonly rolMenuService: RolMenuService,
    private readonly routeAdm: ActivatedRoute,
    private readonly routerAdm: Router
  ) { }
  
  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': atob(sessionStorage.getItem('user'))
    }).subscribe(data => {
      //Logica para capturar los menus para administracion
      if(data.data[0].estado === "1"){
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
      }
    })
  }

  /**
   * Metodo encargado de obtener el valor del check del Baner-Superior 
   * para cerrar o abrir  la barra lateral izquierda
   * @BayronPerez
   */
   onCheckMenuLateral($event: any) {
    if ($event !== undefined) {
      this.checkMenuLateral = $event;
    }

  }

  gotToRouteAdm(menu: any) {
    this.menusAdministracion.forEach(element => {
      element.activo = element.idMenu === menu.idMenu ? 1 : 0;
    });
    this.menusAdministracionTablsContables.forEach(element => {
      element.activo = element.idMenu === menu.idMenu ? 1 : 0;
    });
    this.routerAdm.navigate([`${menu.url}`], {relativeTo: this.routeAdm});
  }

}
