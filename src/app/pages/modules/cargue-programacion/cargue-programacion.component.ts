import { Component, OnInit } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';

@Component({
  selector: 'app-cargue-programacion',
  templateUrl: './cargue-programacion.component.html',
  styleUrls: ['./cargue-programacion.component.css']
})
export class CargueProgramacionComponent implements OnInit {

  menusCargueProgramacion: any[] = [];
  checkMenuLateral: boolean;

  constructor(
    private rolMenuService: RolMenuService,
  ) { }

  ngOnInit(): void {
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': sessionStorage.getItem(atob('user'))
    }).subscribe(data => {
      //Logica para capturar los menus para cargueCertificacion
      let rol = data.data[0].rol.idRol;
      this.rolMenuService.obtenerMenuRol({
        'rol.idRol': rol,
        'estado': "1",
        'menu.idMenuPadre': "carguePreliminar"
      }).subscribe(menusrol => {
        var menuOrdenado = menusrol.data
        menuOrdenado.sort((a,b) => {
          return a.menu.idMenu - b.menu.idMenu
        })
        menuOrdenado.forEach(itm => {
          this.menusCargueProgramacion.push(itm.menu);
        });
      });
    })
  }

  /**
   * @JuanMazo
   * Metodo que permite ver el estado del menu lateral
   * @param $event
   */
  onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }
  }

}
