import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree }
  from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolMenuService } from '../_service/roles-usuarios-service/roles-usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class CentroCiudadPpalGuard implements CanActivate {

  menusAdminPpal: any[] = [];
  menusPpal: any[] = [];

  constructor(
    private rolMenuServicePpal: RolMenuService,
    private routerPpal: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.rolMenuServicePpal.obtenerUsuarios({
        'idUsuario': atob(sessionStorage.getItem('user'))
      }).subscribe(data => {
        //Logica para capturar los menus para cargueCertificacion
        let rolPpal = data.data[0].rol.idRol;
        this.rolMenuServicePpal.obtenerMenuRol({
          'rol.idRol': rolPpal,
          'estado': "1",
          'menu.idMenuPadre': "administracionTabContables"
        }).subscribe(menusrol => {
          this.menusPpal = menusrol;
          menusrol.data.forEach(itm => {
            this.menusAdminPpal.push(itm.menu);
          });
          //validation guard
          let guardOk: boolean = false;
          menusrol.data.forEach(itm => {
            if (itm.menu.url == "centro-ciudad-ppal") {
              guardOk = true;
            }
          });
          if (guardOk) {
            resolve(true);
          } else {
            this.routerPpal.navigate(['/administracion']);
            resolve(false);
          }
        });
      })
    });
  }
}
