import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-banner-superior',
  templateUrl: './banner-superior.component.html',
  styleUrls: ['./banner-superior.component.css']
})
export class BannerSuperiorComponent implements OnInit {

  userName: string = "user@ath.com.co";
  fechaActual : string = "dd/mm/yyyy";

  @Output() checkMenuLateral = new EventEmitter<boolean>();
  estadoMenu = true;

  ngOnInit(): void {
    this.mostrarUsuario();
    this.fechaActual = atob(sessionStorage.getItem('fechasistema')) as string;
  }

  /**
   * Metodo que envía el evento del check para cerrar o abrir el munu lateral
   * @BaironPerez
   */
  eventoMenu(event: any) {
    this.estadoMenu = !this.estadoMenu;
    this.checkMenuLateral.emit(this.estadoMenu);
  }

  mostrarUsuario() {
    this.userName = atob(sessionStorage.getItem('user'));
  }

}
