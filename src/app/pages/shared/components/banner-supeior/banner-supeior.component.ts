import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-banner-supeior',
  templateUrl: './banner-supeior.component.html',
  styleUrls: ['./banner-supeior.component.css']
})
export class BannerSupeiorComponent implements OnInit {

  userName: String = "user@ath.com.co"
  fechaActual : Date = new Date();

  @Output() checkMenuLateral = new EventEmitter<boolean>();
  estadoMenu = true;

  constructor() { }

  ngOnInit(): void {
    this.mostrarUsuario()
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
    this.userName = sessionStorage.getItem('user')
  }

}
