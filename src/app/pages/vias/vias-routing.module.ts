import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViasComponent } from './vias.component';

const routes: Routes = [
    {
      path: '',
      component: ViasComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViasRoutingModule { }
