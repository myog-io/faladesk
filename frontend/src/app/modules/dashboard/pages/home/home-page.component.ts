import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthenticatedUser } from '../../../../store/auth/auth.selectors';
import { AuthenticatedUser } from '../../../../shared/models/auth.models';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readonly user$: Observable<AuthenticatedUser | null> = this.store.select(selectAuthenticatedUser);

  constructor(private readonly store: Store) {}
}
