import { createAction, props } from '@ngrx/store';
import { AuthSession, MagicLinkConfirmPayload, MagicLinkRequestPayload } from '../../shared/models/auth.models';

export const requestMagicLink = createAction('[Auth] Request Magic Link', props<{ payload: MagicLinkRequestPayload }>());
export const requestMagicLinkSuccess = createAction('[Auth] Request Magic Link Success', props<{ message: string }>());
export const requestMagicLinkFailure = createAction('[Auth] Request Magic Link Failure', props<{ error: string }>());

export const confirmMagicLink = createAction('[Auth] Confirm Magic Link', props<{ payload: MagicLinkConfirmPayload }>());
export const confirmMagicLinkSuccess = createAction('[Auth] Confirm Magic Link Success', props<{ session: AuthSession }>());
export const confirmMagicLinkFailure = createAction('[Auth] Confirm Magic Link Failure', props<{ error: string }>());

export const restoreSession = createAction('[Auth] Restore Session');
export const restoreSessionSuccess = createAction('[Auth] Restore Session Success', props<{ session: AuthSession }>());
export const restoreSessionFailure = createAction('[Auth] Restore Session Failure');

export const logout = createAction('[Auth] Logout');
