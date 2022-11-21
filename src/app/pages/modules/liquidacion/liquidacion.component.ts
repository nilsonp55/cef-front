import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.css']
})
export class LiquidacionComponent implements OnInit {

  menusLiquidacion: any[] = [];

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
        'menu.idMenuPadre': "liquidacion"
      }).subscribe(menusrol => {
        menusrol.data.forEach(itm => {
          this.menusLiquidacion.push(itm.menu);
        });
        console.log(menusrol)
      });
    })
  }

}
