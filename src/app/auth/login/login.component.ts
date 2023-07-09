import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UsuarioService } from "src/app/pages/usuarios/usuario.service";
import { AuthService } from "../auth.service";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class LoginComponent {
    public formSummitted = false;
    public loginForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
    ) {
        this.loginForm = this.fb.group({
            email: [
                localStorage.getItem("email") || "",
                [Validators.required, Validators.email],
            ],
            password: ["", Validators.required],
            remember: [false],
        });
    }

    login() {
        this.authService.login(this.loginForm.value).subscribe(
            (res) => {
                if (this.loginForm.get("remember")?.value) {
                    localStorage.setItem(
                        "email",
                        this.loginForm.get("email")?.value
                    );
                } else {
                    localStorage.removeItem("email");
                }
                this.router.navigateByUrl("/admin");
            },
            (err) => {
                console.log(err);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            }
        );
        // this.router.navigateByUrl('/');
    }
}
