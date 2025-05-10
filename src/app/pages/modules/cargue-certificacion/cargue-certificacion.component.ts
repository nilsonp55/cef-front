import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cargue-certificacion',
  templateUrl: './cargue-certificacion.component.html'
})
export class CargueCertificacionComponent implements OnInit {

  menusCargueCertificacion: any[] = [];


  constructor(
    private rolMenuService: RolMenuService,
    private routeCert: ActivatedRoute,
    private routerCert: Router
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
          'menu.idMenuPadre': "cargueCertificacion"
        }).subscribe(menusrol => {
          menusrol.data.forEach(itm => {
            this.menusCargueCertificacion.push(itm.menu);
          });
        });
      }
    })
  }

  gotToRouteCert(menu: any) {
    this.menusCargueCertificacion.forEach(element => {
      element.activo = element.idMenu === menu.idMenu ? 1 : 0;
    });
    this.routerCert.navigate([`${menu.url}`], {relativeTo: this.routeCert});
  }

}
