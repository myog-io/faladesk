export interface MagicLinkRequestPayload {
  email: string;
  tenantSlug: string;
}

export interface MagicLinkConfirmPayload {
  token: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user: AuthenticatedUser;
}
