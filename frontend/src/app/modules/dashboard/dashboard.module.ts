import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomePageComponent } from './pages/home/home-page.component';

@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, IonicModule, TranslocoModule, DashboardRoutingModule]
})
export class DashboardModule {}
