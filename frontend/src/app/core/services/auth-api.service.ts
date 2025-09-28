import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthSession,
  MagicLinkConfirmPayload,
  MagicLinkRequestPayload
} from '../../shared/models/auth.models';

interface MagicLinkRequestResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  requestMagicLink(payload: MagicLinkRequestPayload): Observable<MagicLinkRequestResponse> {
    return this.http.post<MagicLinkRequestResponse>(`${this.baseUrl}/magic-link/request/`, {
      email: payload.email,
      tenant_slug: payload.tenantSlug
    });
  }

  confirmMagicLink(payload: MagicLinkConfirmPayload): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${this.baseUrl}/magic-link/confirm/`, {
      token: payload.token
    });
  }
}
