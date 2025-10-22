import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuStateService } from 'src/app/_service/menu-state-service.service';

@Component({
  selector: 'app-cargue-programacion',
  templateUrl: './cargue-programacion.component.html'
})
export class CargueProgramacionComponent implements OnInit {

  menusCargueProgramacion: any[] = [];
  checkMenuLateral: boolean;

  constructor(
    private readonly rolMenuService: RolMenuService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly menuStateService: MenuStateService
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': atob(sessionStorage.getItem('user'))
    }).subscribe(data => {
      if (data.data[0].estado === "1") {
        //Logica para capturar los menus para cargueCertificacion
        let rol = data.data[0].rol.idRol;
        this.rolMenuService.obtenerMenuRol({
          'rol.idRol': rol,
          'estado': "1",
          'menu.idMenuPadre': "carguePreliminar"
        }).subscribe(menusrol => {
          var menuOrdenado = menusrol.data
          menuOrdenado.sort((a, b) => {
            return a.menu.idMenu - b.menu.idMenu
          })
          menuOrdenado.forEach(itm => {
            this.menusCargueProgramacion.push(itm.menu);
          });
        });
      }
    })
  }

  /**
   * @JuanMazo
   * Metodo que permite ver el estado del menu lateral
   * @param $event
   */
  onCheckMenuLateral($event) {
    if ($event !== undefined) {
      this.checkMenuLateral = $event;
    }
  }

  gotToRoute(menu: any) {
    this.menusCargueProgramacion.forEach(element => {
      element.activo = element.idMenu === menu.idMenu ? 1 : 0;
    });
    this.menuStateService.setMenuActivo(menu.nombre);
    this.router.navigate([`${menu.url}`], { relativeTo: this.route });
  }

}
