import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-banner-supeior',
  templateUrl: './banner-supeior.component.html',
  styleUrls: ['./banner-supeior.component.css']
})
export class BannerSupeiorComponent implements OnInit {

  @Output() checkMenuLateral = new EventEmitter<boolean>();
  estadoMenu = true;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Metodo que envía el evento del check para cerrar o abrir el munu lateral
   * @BaironPerez
   */
  eventoMenu(event: any) {
    this.estadoMenu = !this.estadoMenu;
    this.checkMenuLateral.emit(this.estadoMenu);
  }

}
