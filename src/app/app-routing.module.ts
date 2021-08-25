import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CakeComponent } from './components/cake/cake.component';

// const routes: Routes = [{ path: '', component: CakeComponent }];
const appRoutes: Routes = [
  { path: '', component: CakeComponent },
  { path: 'cake/:id', component: CakeComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
