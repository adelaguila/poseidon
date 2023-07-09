import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectoresRoutingModule } from './sectores-routing.module';
import { SectoresComponent } from './sectores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';


@NgModule({
  declarations: [
    SectoresComponent
  ],
  imports: [
    CommonModule,
    SectoresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidosModule
  ]
})
export class SectoresModule { }
