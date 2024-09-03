import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ManejoFechaToken } from '../../shared/utils/manejo-fecha-token';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { GENERALES } from '../../shared/constantes';
import { VentanaEmergenteResponseComponent } from '../../shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-conciliacion-costos',
  templateUrl: './conciliacion-costos.component.html'
})
export class ConciliacionCostosComponent implements OnInit {

  @Input() estadoMenu = true;
  isLinear = false;
  checkMenuLateral: boolean;
  menusConciliacionCostos: any[] = [];

  constructor(private rolMenuService: RolMenuService, private dialog: MatDialog, private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.rolMenuService.obtenerUsuarios({
      'idUsuario': atob(sessionStorage.getItem('user'))
    }).subscribe(data => {
      //Logica para capturar los menus para conciliacion-costos
      let rol = data.data[0].rol.idRol;
      this.rolMenuService.obtenerMenuRol({
        'rol.idRol': rol,
        'estado': "1",
        'menu.idMenuPadre': "conciliacionCostos"
      }).subscribe(menusrol => {
        var menuOrdenado = menusrol.data
        menuOrdenado.sort((a, b) => {
          return a.menu.idMenu - b.menu.idMenu
        })
        menusrol.data.forEach(itm => {
          this.menusConciliacionCostos.push(itm.menu);
        });
        console.log(this.menusConciliacionCostos);
      });
    })
  }

  /**
   * Metodo encargado de obtener el valor del check del Baner-Superior
   * para cerrar o abrir  la barra lateral izquierda
   * @WilliamBecerra
   */
  onCheckMenuLateral($event) {
    if ($event !== undefined) {
      (this.checkMenuLateral = $event).toString();
    }

  }

  validarMenuProximo(menu) {
    if (menu.nombre === "") {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: "Este elemento no forma parte del alcance de esta versión.",
          codigo: GENERALES.CODE_EMERGENT.WARNING
        }
      });
    } else {
      this.menusConciliacionCostos.forEach(element => {
        if (element.idMenu === menu.idMenu) {
          element.activo = 1
        } else {
          element.activo = 0
        }
      });
      this.router.navigate(["/conciliacion-costos/" + menu.url])
    }
  }


}
