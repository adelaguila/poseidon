import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanesComponent } from './planes.component';

const routes: Routes = [
    {
      path: '',
      component: PlanesComponent
    }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanesRoutingModule { }
