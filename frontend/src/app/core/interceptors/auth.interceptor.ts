import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const session = this.authService.snapshot;
    const tenantSlug = environment.tenantSlug;

    let headers = req.headers;
    if (session?.accessToken) {
      headers = headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
    if (tenantSlug) {
      headers = headers.set('X-Tenant', tenantSlug);
    }

    return next.handle(req.clone({ headers }));
  }
}
