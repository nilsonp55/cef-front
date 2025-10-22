import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuStateService } from 'src/app/_service/menu-state-service.service';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html'
})
export class ConciliacionComponent implements OnInit {

  @Input() estadoMenu = true;
  isLinear = false;
  checkMenuLateral: boolean;
  menusConciliacion: any[] = [];

  constructor(
    private readonly rolMenuService: RolMenuService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly menuStateService: MenuStateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

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
          'menu.idMenuPadre': "conciliacion"
        }).subscribe(menusrol => {
          var menuOrdenado = menusrol.data
          menuOrdenado.sort((a, b) => {
            return a.menu.idMenu - b.menu.idMenu
          })
          menusrol.data.forEach(itm => {
            this.menusConciliacion.push(itm.menu);
          });
        });
      }
    })
  }

  /**
   * Metodo encargado de obtener el valor del check del Baner-Superior 
   * para cerrar o abrir  la barra lateral izquierda
   * @BaironPerez
   */
  onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }

  }

  gotToRoute(menu: any) {
    this.menusConciliacion.forEach(element => {
      element.activo = element.idMenu === menu.idMenu ? 1 : 0;
    });
    this.menuStateService.setMenuActivo(menu.nombre);
    this.router.navigate([`${menu.url}`], { relativeTo: this.route });
  }

}
