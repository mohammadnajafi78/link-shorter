import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/client/client.module').then((m) => m.ClientModule),
      },
      {
        path: 'admin/dashboard',
        loadChildren: () =>
          import('./pages/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'member/dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {path: '**', redirectTo: 'page/not-found'}
    ],

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
