import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AbonadosComponent } from "./abonados.component";
import { AbonadosFormComponent } from "./abonados-form/abonados-form.component";

const routes: Routes = [
    {
        path: "",
        component: AbonadosComponent,
    },

    {
        path: 'formulario/:id',
        component: AbonadosFormComponent
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AbonadosRoutingModule {}
