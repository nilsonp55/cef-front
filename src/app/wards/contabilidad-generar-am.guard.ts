import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree }
  from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolMenuService } from '../_service/roles-usuarios-service/roles-usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadGenerarAmGuard implements CanActivate {

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
      debugger
      this.rolMenuService.obtenerUsuarios({
        'idUsuario': atob(sessionStorage.getItem('user'))
      }).subscribe(data => {
        //Logica para capturar los menus para cargueCertificacion
        let rol = data.data[0].rol.idRol;
        this.rolMenuService.obtenerMenuRol({
          'rol.idRol': rol,
          'estado': "1",
          'menu.idMenuPadre': "contabilidad"
        }).subscribe(menusrol => {
          this.menus = menusrol;
          menusrol.data.forEach(itm => {
            this.menusLiquidacion.push(itm.menu);
          });
          console.log(menusrol)
          //validation guard
          let guardOk: boolean = false;
          menusrol.data.forEach(itm => {
            if (itm.menu.url == "generar-contabilidad-am") {
              guardOk = true;
            }
          });
          if (guardOk) {
            resolve(true);
          } else {
            this.router.navigate(['/contabilidad']);
            resolve(false);
          }
        });
      })
    });
  }
}