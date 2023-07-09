import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajasnapRoutingModule } from './cajasnap-routing.module';
import { CajasnapComponent } from './cajasnap.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';


@NgModule({
  declarations: [
    CajasnapComponent
  ],
  imports: [
    CommonModule,
    CajasnapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidosModule
  ]
})
export class CajasnapModule { }
