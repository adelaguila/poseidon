import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PagesComponent } from "./pages.component";

const routes: Routes = [
    {
        path: "",
        component: PagesComponent,
        children: [
            {
                path: "",
                loadChildren: () =>
                    import("./dashboard/dashboard.module").then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: "terceros",
                loadChildren: () =>
                    import("./terceros/terceros.module").then(
                        (m) => m.TercerosModule
                    ),
            },
            {
                path: "cajasnap",
                loadChildren: () =>
                    import("./cajasnap/cajasnap.module").then(
                        (m) => m.CajasnapModule
                    ),
            },
            {
                path: "planes",
                loadChildren: () =>
                    import("./planes/planes.module").then(
                        (m) => m.PlanesModule
                    ),
            },
            {
                path: "vias",
                loadChildren: () =>
                    import("./vias/vias.module").then((m) => m.ViasModule),
            },
            {
                path: "sectores",
                loadChildren: () =>
                    import("./sectores/sectores.module").then((m) => m.SectoresModule),
            },
            {
                path: "tipos-ordenes-atenciones",
                loadChildren: () =>
                    import("./tipos-ordenes-atenciones/tipos-ordenes-atenciones.module").then((m) => m.TiposOrdenesAtencionesModule),
            },
            {
                path: "abonados",
                loadChildren: () =>
                    import("./abonados/abonados.module").then((m) => m.AbonadosModule),
            },
            {
                path: "usuarios",
                loadChildren: () =>
                    import("./usuarios/usuarios.module").then((m) => m.UsuariosModule),
            },
            {
                path: "ubigeos",
                loadChildren: () =>
                    import("./ubigeos/ubigeos.module").then((m) => m.UbigeosModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
