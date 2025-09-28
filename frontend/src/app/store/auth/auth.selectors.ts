import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(selectAuthState, (state) => !!state.accessToken);
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectMagicLinkRequesting = createSelector(selectAuthState, (state) => state.requestingMagicLink);
export const selectAuthMessage = createSelector(selectAuthState, (state) => state.message);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectAuthHydrated = createSelector(selectAuthState, (state) => state.hydrated);
export const selectAuthenticatedUser = createSelector(selectAuthState, (state) => state.user);
