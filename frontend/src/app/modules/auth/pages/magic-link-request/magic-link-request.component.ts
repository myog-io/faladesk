import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  requestMagicLink
} from '../../../../store/auth/auth.actions';
import {
  selectAuthError,
  selectAuthMessage,
  selectMagicLinkRequesting
} from '../../../../store/auth/auth.selectors';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-magic-link-request',
  templateUrl: './magic-link-request.component.html',
  styleUrls: ['./magic-link-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MagicLinkRequestComponent {
  readonly requesting$: Observable<boolean> = this.store.select(selectMagicLinkRequesting);
  readonly message$: Observable<string | undefined> = this.store.select(selectAuthMessage);
  readonly error$: Observable<string | undefined> = this.store.select(selectAuthError);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private readonly fb: FormBuilder, private readonly store: Store) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(
      requestMagicLink({
        payload: { email: this.form.getRawValue().email, tenantSlug: environment.tenantSlug }
      })
    );
  }
}
