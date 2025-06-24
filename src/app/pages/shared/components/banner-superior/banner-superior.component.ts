import { Component, EventEmitter, OnInit, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-banner-superior',
  templateUrl: './banner-superior.component.html',
  styleUrls: ['./banner-superior.component.css']
})
export class BannerSuperiorComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer) {}

  userName: string = "";
  fechaActual : string = "";

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
    const userData = atob(sessionStorage.getItem('user') as string);
    this.userName = this.sanitizer.sanitize(SecurityContext.HTML, userData) || '';
  }

}
