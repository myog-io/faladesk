import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { selectAuthHydrated, selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return combineLatest([
      this.store.select(selectAuthHydrated),
      this.store.select(selectIsAuthenticated)
    ]).pipe(
      filter(([hydrated]) => hydrated),
      take(1),
      map(([, authenticated]) => {
        if (authenticated) {
          return true;
        }
        return this.router.parseUrl('/auth/magic-link-request');
      })
    );
  }
}
