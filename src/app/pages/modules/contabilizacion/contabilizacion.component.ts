import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';

@Component({
  selector: 'app-contabilizacion',
  templateUrl: './contabilizacion.component.html',
  styleUrls: ['./contabilizacion.component.css']
})
export class ContabilizacionComponent implements OnInit {

  menusContabilidad: any[] = [];

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
        'menu.idMenuPadre': "contabilidad"
      }).subscribe(menusrol => {
        menusrol.data.forEach(itm => {
          this.menusContabilidad.push(itm.menu);
        });
        console.log(menusrol)
      });
    })
  }

}
