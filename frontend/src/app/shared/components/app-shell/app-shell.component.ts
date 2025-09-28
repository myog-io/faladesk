import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from '../../../store/auth/auth.actions';
import { selectAuthenticatedUser } from '../../../store/auth/auth.selectors';
import { AuthenticatedUser } from '../../models/auth.models';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  readonly user$: Observable<AuthenticatedUser | null> = this.store.select(selectAuthenticatedUser);
  darkMode = false;

  constructor(private readonly store: Store, private readonly router: Router) {}

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
  }

  signOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/auth/magic-link-request']);
  }
}
