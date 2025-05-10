import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contabilizacion',
  templateUrl: './contabilizacion.component.html'
})
export class ContabilizacionComponent implements OnInit {

  menusContabilidad: any[] = [];

  constructor(
    private rolMenuService: RolMenuService,
    private routeCont: ActivatedRoute,
    private routerCont: Router
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': atob(sessionStorage.getItem('user'))
    }).subscribe(data => {
      if(data.data[0].estado === "1"){
        //Logica para capturar los menus para cargueCertificacion
        let rol = data.data[0].rol.idRol;
        this.rolMenuService.obtenerMenuRol({
          'rol.idRol': rol,
          'estado': "1",
          'menu.idMenuPadre': "contabilidad"
        }).subscribe(menusrol => {
          menusrol.data.forEach(itm => {
            this.menusContabilidad.push(itm.menu);
          });
        });
      }
    })
  }

  gotToRouteCont(menu: any) {
    this.menusContabilidad.forEach(element => {
      element.activo = element.idMenu === menu.idMenu ? 1 : 0;
    });
    this.routerCont.navigate([`${menu.url}`], {relativeTo: this.routeCont});
  }
}
