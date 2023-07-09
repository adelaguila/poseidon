import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { RedirectGuard } from "./guards/redirect.guard";
import { AuthGuard } from "./guards/auth.guard";

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    canActivate: [RedirectGuard],
                    loadChildren: () =>
                        import("./auth/auth.module").then(
                            (m) => m.AuthModule
                        ),
                },
                {
                    path: 'admin',
                    component: AppMainComponent,
                    canActivate: [AuthGuard],
                    children: [
                        {
                            path: '',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import("./pages/pages.module").then((m) => m.PagesModule),
                        },
                        {
                            path: 'demo',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import("./demo/demo.module").then((m) => m.DemoModule),
                        },
                    ],
                },
                { path: "error", component: AppErrorComponent },
                { path: "access", component: AppAccessdeniedComponent },
                { path: "notfound", component: AppNotfoundComponent },
                {
                    path: "login",
                    loadChildren: () =>
                        import("./auth/auth.module").then((m) => m.AuthModule),
                },

                { path: "**", redirectTo: "/notfound" },
            ],
            { scrollPositionRestoration: "enabled" }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
