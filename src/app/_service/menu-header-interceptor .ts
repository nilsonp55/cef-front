import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MenuStateService } from "./menu-state-service.service";
import { Observable } from "rxjs";



@Injectable()
export class MenuHeaderInterceptor implements HttpInterceptor {

  constructor(private menuStateService: MenuStateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const menuActivo = this.menuStateService.getMenuActivo();

    // Solo agregamos el header si hay un menú seleccionado
    if (menuActivo) {
      const cloned = req.clone({
        setHeaders: {
          'X-Menu-Id': menuActivo   // 👈 Aquí tu header personalizado
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
