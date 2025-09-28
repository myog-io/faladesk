import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TenantGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredTenant = route.queryParamMap.get('tenant') ?? environment.tenantSlug;
    if (!requiredTenant) {
      return this.router.parseUrl('/auth/magic-link-request');
    }
    return true;
  }
}
