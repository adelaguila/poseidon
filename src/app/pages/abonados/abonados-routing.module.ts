import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AbonadosComponent } from "./abonados.component";

const routes: Routes = [
    {
        path: "",
        component: AbonadosComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AbonadosRoutingModule {}
