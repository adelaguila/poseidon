import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectoresComponent } from './sectores.component';

const routes: Routes = [
    {
      path: '',
      component: SectoresComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectoresRoutingModule { }
