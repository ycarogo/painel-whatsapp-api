import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInstancesComponent } from './pages/list-instances/list-instances.component';

const routes: Routes = [
  { path: '', component: ListInstancesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
