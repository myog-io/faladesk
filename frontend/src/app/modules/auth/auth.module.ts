import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';

import { AuthRoutingModule } from './auth-routing.module';
import { MagicLinkConfirmComponent } from './pages/magic-link-confirm/magic-link-confirm.component';
import { MagicLinkRequestComponent } from './pages/magic-link-request/magic-link-request.component';

@NgModule({
  declarations: [MagicLinkRequestComponent, MagicLinkConfirmComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, TranslocoModule, AuthRoutingModule]
})
export class AuthModule {}
