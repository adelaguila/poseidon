import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposOrdenesAtencionesRoutingModule } from './tipos-ordenes-atenciones-routing.module';
import { TiposOrdenesAtencionesComponent } from './tipos-ordenes-atenciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';


@NgModule({
  declarations: [
    TiposOrdenesAtencionesComponent
  ],
  imports: [
    CommonModule,
    TiposOrdenesAtencionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidosModule
  ]
})
export class TiposOrdenesAtencionesModule { }
