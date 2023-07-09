import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanesRoutingModule } from './planes-routing.module';
import { PlanesComponent } from './planes.component';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlanesComponent
  ],
  imports: [
    CommonModule,
    PlanesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidosModule
  ]
})
export class PlanesModule { }
