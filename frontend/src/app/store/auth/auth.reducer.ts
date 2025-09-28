import { createReducer, on } from '@ngrx/store';
import { AuthSession, AuthenticatedUser } from '../../shared/models/auth.models';
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

export interface AuthState {
  loading: boolean;
  requestingMagicLink: boolean;
  message?: string;
  user: AuthenticatedUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  error?: string;
  hydrated: boolean;
}

const initialState: AuthState = {
  loading: false,
  requestingMagicLink: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false
};

function extractSession(session: AuthSession): Pick<AuthState, 'user' | 'accessToken' | 'refreshToken'> {
  return {
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken ?? null
  };
}

export const authReducer = createReducer(
  initialState,
  on(requestMagicLink, (state) => ({
    ...state,
    requestingMagicLink: true,
    message: undefined,
    error: undefined
  })),
  on(requestMagicLinkSuccess, (state, { message }) => ({
    ...state,
    requestingMagicLink: false,
    message,
    error: undefined
  })),
  on(requestMagicLinkFailure, (state, { error }) => ({
    ...state,
    requestingMagicLink: false,
    error
  })),
  on(confirmMagicLink, (state) => ({
    ...state,
    loading: true,
    error: undefined
  })),
  on(confirmMagicLinkSuccess, (state, { session }) => ({
    ...state,
    ...extractSession(session),
    loading: false,
    hydrated: true
  })),
  on(confirmMagicLinkFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(restoreSession, (state) => ({
    ...state,
    loading: true
  })),
  on(restoreSessionSuccess, (state, { session }) => ({
    ...state,
    ...extractSession(session),
    loading: false,
    hydrated: true
  })),
  on(restoreSessionFailure, (state) => ({
    ...state,
    loading: false,
    hydrated: true,
    accessToken: null,
    refreshToken: null,
    user: null
  })),
  on(logout, () => ({ ...initialState, hydrated: true }))
);
