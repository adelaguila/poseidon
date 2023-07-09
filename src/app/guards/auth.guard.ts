import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from "@angular/router";
import { tap } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("AuthGuard");

        return this.authService.validarToken().pipe(
            tap((estaAutenticado: boolean) => {
                if (!estaAutenticado) {
                    this.router.navigateByUrl("/login");
                }
            })
        );
    }
}
