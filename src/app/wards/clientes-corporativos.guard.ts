import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RolMenuService } from '../_service/roles-usuarios-service/roles-usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesCorporativosGuard implements CanActivate {

  menusAdministracion: any[] = [];
  menus: any[] = [];

  constructor(
    private rolMenuService: RolMenuService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise( (resolve, reject) => { 
      this.rolMenuService.obtenerUsuarios({
        'idUsuario': atob(sessionStorage.getItem('user'))
      }).subscribe(data => { 
        let rol = data.data[0].rol.idRol;
        this.rolMenuService.obtenerMenuRol({
          'rol.idRol': rol,
          'estado': "1",
          'menu.idMenuPadre': "administracion"
        }).subscribe(menusrol => {
          this.menus = menusrol;
          menusrol.data.forEach(itm => {
            this.menusAdministracion.push(itm.menu);
          });
          let guardOk: boolean = false;
          menusrol.data.forEach(itm => {
            if (itm.menu.url == "clientes-corporativos") {
              guardOk = true;
            }
          });
          if (guardOk) {
            resolve(true);
          } else {
            this.router.navigate(['/administracion']);
            resolve(false);
          }
        });
      })
    });
  }

}
