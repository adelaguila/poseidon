import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenesAtencionesRoutingModule } from './ordenes-atenciones-routing.module';
import { OrdenesAtencionesComponent } from './ordenes-atenciones.component';


@NgModule({
  declarations: [
    OrdenesAtencionesComponent
  ],
  imports: [
    CommonModule,
    OrdenesAtencionesRoutingModule
  ]
})
export class OrdenesAtencionesModule { }
