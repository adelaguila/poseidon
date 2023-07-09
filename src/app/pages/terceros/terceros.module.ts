import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TercerosRoutingModule } from './terceros-routing.module';
import { TercerosComponent } from './terceros.component';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TercerosEditComponent } from './terceros-edit/terceros-edit.component';


@NgModule({
  declarations: [
    TercerosComponent,
    TercerosEditComponent
  ],
  imports: [
    CommonModule,
    TercerosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidosModule
  ]
})
export class TercerosModule { }
