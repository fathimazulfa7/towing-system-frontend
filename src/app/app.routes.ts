import { Routes } from '@angular/router';
import { TowingListComponent } from './components/towing-list/towing-list';
import { TowingFormComponent } from './components/towing-form/towing-form';
import { TowingDetailComponent } from './components/towing-detail/towing-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: TowingListComponent },
  { path: 'create', component: TowingFormComponent },
  { path: 'edit/:id', component: TowingFormComponent },
  { path: 'detail/:id', component: TowingDetailComponent },
  { path: '**', redirectTo: '/list' }
];
