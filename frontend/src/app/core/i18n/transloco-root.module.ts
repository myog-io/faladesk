import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import {
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  TranslocoConfig,
  TranslocoModule,
  TranslocoService,
  TranslocoLoader
} from '@ngneat/transloco';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private readonly http: HttpClient) {}

  getTranslation(lang: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  imports: [TranslocoModule],
  exports: [TranslocoModule],
  providers: [
    { provide: TRANSLOCO_CONFIG, useFactory: provideTranslocoConfig },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  ]
})
export class TranslocoRootModule {
  constructor(private readonly translocoService: TranslocoService) {
    const availableLangs = ['pt', 'en', 'es'];
    translocoService.setAvailableLangs(availableLangs);
    translocoService.setDefaultLang('pt');
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.slice(0, 2);
      if (availableLangs.includes(browserLang)) {
        translocoService.setActiveLang(browserLang);
      }
    }
  }
}

export function provideTranslocoConfig(): TranslocoConfig {
  return {
    availableLangs: ['pt', 'en', 'es'],
    defaultLang: 'pt',
    reRenderOnLangChange: true,
    prodMode: environment.production
  };
}
