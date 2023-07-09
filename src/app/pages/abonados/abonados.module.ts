import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AbonadosRoutingModule } from "./abonados-routing.module";
import { AbonadosComponent } from "./abonados.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CompartidosModule } from "src/app/compartidos/compartidos.module";

@NgModule({
    declarations: [AbonadosComponent],
    imports: [
        CommonModule,
        AbonadosRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CompartidosModule,
    ],
})
export class AbonadosModule {}
