import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
// import { UsuariosService } from '../modulos/usuarios/usuarios.service';
import { TokenService } from '../compartidos/servicios/token.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private tokenService: TokenService
      ) {}

      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('RedirectGuard');

        const token = this.tokenService.obtenerToken();
        if (token) {
          return this.authService.validarToken().pipe(
            tap((estaAutenticado: boolean) => {
              if (estaAutenticado) {
                this.router.navigateByUrl('/admin');
              } else {
                this.tokenService.eliminarToken();
                this.router.navigateByUrl('/login');
              }
            })
          );
        }
        return true;
      }

}
