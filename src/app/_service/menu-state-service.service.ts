import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private menuActivoId: string | null = null;

  setMenuActivo(idMenu: string) {
    this.menuActivoId = idMenu;
  }

  getMenuActivo(): string | null {
    return this.menuActivoId;
  }
}
