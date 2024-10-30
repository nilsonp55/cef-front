import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';
import { ActivatedRoute, Router } from '@angular/router';

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
    private rolMenuService: RolMenuService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': atob(sessionStorage.getItem('user'))
    }).subscribe(data => {
      //Logica para capturar los menus para cargueCertificacion
      let rol = data.data[0].rol.idRol;
      this.rolMenuService.obtenerMenuRol({
        'rol.idRol': rol,
        'estado': "1",
        'menu.idMenuPadre': "conciliacion"
      }).subscribe(menusrol => {
        var menuOrdenado = menusrol.data
        menuOrdenado.sort((a,b) => {
          return a.menu.idMenu - b.menu.idMenu
        })
        menusrol.data.forEach(itm => {
          this.menusConciliacion.push(itm.menu);
        });
      });
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
    this.router.navigate([`${menu.url}`], {relativeTo: this.route});
  }
  
}
