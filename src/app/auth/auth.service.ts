import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Usuario } from "../pages/usuarios/usuario.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { TokenService } from "../compartidos/servicios/token.service";
import { Observable, catchError, map, of, tap } from "rxjs";
import { checkToken } from "../compartidos/interceptores/token.interceptor";
import { LoginForm } from "../interfaces";

const api_url = environment.api_url;

@Injectable({
    providedIn: "root",
})
export class AuthService {
    public usuario!: Usuario;

    constructor(
        private http: HttpClient,
        private router: Router,
        private tokenService: TokenService,
    ) {}

    login(formData: LoginForm) {
        return this.http.post(`${api_url}/auth/login`, formData).pipe(
            tap((resp: any) => {
                this.tokenService.guardarToken(resp.token);
            })
        );
    }

    logout() {
        this.tokenService.eliminarToken();
        this.router.navigateByUrl("/login");
    }

    validarToken(): Observable<boolean> {
        return this.http
            .get(`${api_url}/auth/check-status`, { context: checkToken() })
            .pipe(
                map((resp: any) => {
                    const {
                        id,
                        email,
                        fullName,
                        isActive,
                        image,
                        roles,
                        google,
                    } = resp.usuario;
                    this.usuario = new Usuario(
                        email,
                        fullName,
                        isActive,
                        "",
                        google,
                        roles,
                        image,
                        id
                    );
                    this.tokenService.guardarToken(resp.token);
                    return true;
                }),
                catchError((error) => of(false))
            );
    }
}
