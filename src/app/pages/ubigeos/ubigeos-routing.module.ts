import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbigeosComponent } from './ubigeos.component';

const routes: Routes = [
    {
      path: '',
      component: UbigeosComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbigeosRoutingModule { }
