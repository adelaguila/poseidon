import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UbigeosRoutingModule } from './ubigeos-routing.module';
import { UbigeosComponent } from './ubigeos.component';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';


@NgModule({
  declarations: [
    UbigeosComponent
  ],
  imports: [
    CommonModule,
    UbigeosRoutingModule,
    CompartidosModule
  ]
})
export class UbigeosModule { }
