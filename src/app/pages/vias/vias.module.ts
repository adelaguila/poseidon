import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViasRoutingModule } from './vias-routing.module';
import { ViasComponent } from './vias.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';


@NgModule({
  declarations: [
    ViasComponent
  ],
  imports: [
    CommonModule,
    ViasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidosModule
  ]
})
export class ViasModule { }
