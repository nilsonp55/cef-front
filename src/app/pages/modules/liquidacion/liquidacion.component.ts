import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html'
})
export class LiquidacionComponent implements OnInit {

  menusLiquidacion: any[] = [];

  constructor(
    private rolMenuService: RolMenuService,
    private routeLiq: ActivatedRoute,
    private routerLiq: Router
  ) { }

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
        'menu.idMenuPadre': "liquidacion"
      }).subscribe(menusrol => {
        menusrol.data.forEach(itm => {
          this.menusLiquidacion.push(itm.menu);
        });
      });
    })
  }

  gotToRouteLiq(menu: any) {
    this.menusLiquidacion.forEach(element => {
      element.activo = element.idMenu === menu.idMenu ? 1 : 0;
    });
    this.routerLiq.navigate([`${menu.url}`], {relativeTo: this.routeLiq});
  }

}
