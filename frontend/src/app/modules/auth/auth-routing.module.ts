import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MagicLinkConfirmComponent } from './pages/magic-link-confirm/magic-link-confirm.component';
import { MagicLinkRequestComponent } from './pages/magic-link-request/magic-link-request.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'magic-link-request',
        component: MagicLinkRequestComponent
      },
      {
        path: 'magic-link-confirm',
        component: MagicLinkConfirmComponent
      },
      {
        path: '',
        redirectTo: 'magic-link-request',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
