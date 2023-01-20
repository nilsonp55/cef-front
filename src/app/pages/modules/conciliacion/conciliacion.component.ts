import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.css']
})
export class ConciliacionComponent implements OnInit {

  @Input() estadoMenu = true;
  isLinear = false;
  checkMenuLateral: boolean;
  menusConsiliacion: any[] = [];

  constructor(
    private rolMenuService: RolMenuService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': sessionStorage.getItem(atob('user'))
    }).subscribe(data => {
      //Logica para capturar los menus para cargueCertificacion
      let rol = data.data[0].rol.idRol;
      this.rolMenuService.obtenerMenuRol({
        'rol.idRol': rol,
        'estado': "1",
        'menu.idMenuPadre': "conciliacion"
      }).subscribe(menusrol => {
        var menuOrdenado = menusrol.data
        menuOrdenado.sort((a,b) => {
          return a.menu.idMenu - b.menu.idMenu
        })
        menusrol.data.forEach(itm => {
          this.menusConsiliacion.push(itm.menu);
        });
      });
    })
  }

  /**
   * Metodo encargado de obtener el valor del check del Baner-Superior 
   * para cerrar o abrir  la barra lateral izquierda
   * @BaironPerez
   */
  onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }

  }
  
}
