import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree }
  from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolMenuService } from '../_service/roles-usuarios-service/roles-usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AdministracionTipoCentroCostosGuard implements CanActivate {

  menusLiquidacion: any[] = [];
  menus: any[] = [];

  constructor(
    private rolMenuService: RolMenuService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.rolMenuService.obtenerUsuarios({
        'idUsuario': atob(sessionStorage.getItem('user'))
      }).subscribe(data => {
        //Logica para capturar los menus para cargueCertificacion
        let rol = data.data[0].rol.idRol;
        this.rolMenuService.obtenerMenuRol({
          'rol.idRol': rol,
          'estado': "1",
          'menu.idMenuPadre': "administracionTabContables"
        }).subscribe(menusrol => {
          this.menus = menusrol;
          menusrol.data.forEach(itm => {
            this.menusLiquidacion.push(itm.menu);
          });
          //console.log(menusrol)
          //validation guard
          let guardOk: boolean = false;
          menusrol.data.forEach(itm => {
            if (itm.menu.url == "administracion-tipo-centro-costos") {
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
