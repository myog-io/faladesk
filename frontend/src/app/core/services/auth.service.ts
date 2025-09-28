import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthSession } from '../../shared/models/auth.models';

const AUTH_SESSION_KEY = 'faladesk.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session$ = new BehaviorSubject<AuthSession | null>(null);

  get sessionChanges(): Observable<AuthSession | null> {
    return this.session$.asObservable();
  }

  get snapshot(): AuthSession | null {
    return this.session$.getValue();
  }

  async restoreFromStorage(): Promise<void> {
    const stored = await Preferences.get({ key: AUTH_SESSION_KEY });
    if (stored.value) {
      try {
        const parsed = JSON.parse(stored.value) as AuthSession;
        this.session$.next(parsed);
      } catch (error) {
        console.warn('Failed to parse stored auth session', error);
        await Preferences.remove({ key: AUTH_SESSION_KEY });
        this.session$.next(null);
      }
    }
  }

  async persistSession(session: AuthSession): Promise<void> {
    this.session$.next(session);
    await Preferences.set({ key: AUTH_SESSION_KEY, value: JSON.stringify(session) });
  }

  async clearSession(): Promise<void> {
    this.session$.next(null);
    await Preferences.remove({ key: AUTH_SESSION_KEY });
  }
}
