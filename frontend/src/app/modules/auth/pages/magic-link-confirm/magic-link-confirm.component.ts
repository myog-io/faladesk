import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import { confirmMagicLink } from '../../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-magic-link-confirm',
  templateUrl: './magic-link-confirm.component.html',
  styleUrls: ['./magic-link-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MagicLinkConfirmComponent {
  readonly loading$: Observable<boolean> = this.store.select(selectAuthLoading);
  readonly error$: Observable<string | undefined> = this.store.select(selectAuthError);

  readonly form = this.fb.nonNullable.group({
    token: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private readonly fb: FormBuilder, private readonly store: Store, private readonly router: Router) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(confirmMagicLink({ payload: { token: this.form.getRawValue().token } }));
    this.store
      .select(selectIsAuthenticated)
      .pipe(
        filter((authenticated) => authenticated),
        take(1)
      )
      .subscribe(() => this.router.navigate(['/workspace']));
  }
}
