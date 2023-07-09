import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TercerosComponent } from './terceros.component';
import { TercerosEditComponent } from './terceros-edit/terceros-edit.component';

const routes: Routes = [
    {
      path: '',
      component: TercerosComponent
    },
    {
        path: 'actualizar/:id',
        component: TercerosEditComponent
      }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TercerosRoutingModule { }
