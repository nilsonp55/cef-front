import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';

@Component({
  selector: 'app-cargue-certificacion',
  templateUrl: './cargue-certificacion.component.html',
  styleUrls: ['./cargue-certificacion.component.css']
})
export class CargueCertificacionComponent implements OnInit {

  menusCargueCertificacion: any[] = [];


  constructor(
    private rolMenuService: RolMenuService,
  ) { }

  ngOnInit(): void {
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': sessionStorage.getItem('user')
    }).subscribe(data => {
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
        console.log({menusrol})
      });
    })
  }

}
