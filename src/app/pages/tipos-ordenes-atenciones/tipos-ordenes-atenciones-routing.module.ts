import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiposOrdenesAtencionesComponent } from './tipos-ordenes-atenciones.component';

const routes: Routes = [
    {
      path: '',
      component: TiposOrdenesAtencionesComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposOrdenesAtencionesRoutingModule { }
