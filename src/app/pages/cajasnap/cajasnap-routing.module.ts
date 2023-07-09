import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CajasnapComponent } from "./cajasnap.component";

const routes: Routes = [
    {
        path: "",
        component: CajasnapComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CajasnapRoutingModule {}
