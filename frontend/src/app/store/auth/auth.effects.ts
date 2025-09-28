import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthService } from '../../core/services/auth.service';
import {
  confirmMagicLink,
  confirmMagicLinkFailure,
  confirmMagicLinkSuccess,
  logout,
  requestMagicLink,
  requestMagicLinkFailure,
  requestMagicLinkSuccess,
  restoreSession,
  restoreSessionFailure,
  restoreSessionSuccess
} from './auth.actions';

@Injectable()
export class AuthEffects {
  requestMagicLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestMagicLink),
      switchMap(({ payload }) =>
        this.authApi.requestMagicLink(payload).pipe(
          map((response) => requestMagicLinkSuccess({ message: response.message })),
          catchError((error) => of(requestMagicLinkFailure({ error: error.message ?? 'magic_link_request_failed' })))
        )
      )
    )
  );

  confirmMagicLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmMagicLink),
      switchMap(({ payload }) =>
        this.authApi.confirmMagicLink(payload).pipe(
          switchMap((session) =>
            from(this.authService.persistSession(session)).pipe(
              map(() => confirmMagicLinkSuccess({ session }))
            )
          ),
          catchError((error) => of(confirmMagicLinkFailure({ error: error.message ?? 'magic_link_confirm_failed' })))
        )
      )
    )
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(restoreSession),
      switchMap(() =>
        from(this.authService.restoreFromStorage()).pipe(
          switchMap(() => {
            const session = this.authService.snapshot;
            if (session) {
              return of(restoreSessionSuccess({ session }));
            }
            return of(restoreSessionFailure());
          })
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        switchMap(() => from(this.authService.clearSession()))
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authApi: AuthApiService,
    private readonly authService: AuthService
  ) {}
}
