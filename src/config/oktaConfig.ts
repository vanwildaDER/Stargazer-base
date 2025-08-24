import { OktaAuth, OAuthResponseType } from '@okta/okta-auth-js';

export interface OktaConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  logoutRedirectUri: string;
  scopes: string[];
  responseType: OAuthResponseType;
}

const getOktaConfig = (): OktaConfig => {
  const domain = import.meta.env.VITE_OKTA_DOMAIN;
  const clientId = import.meta.env.VITE_OKTA_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_OKTA_REDIRECT_URI || `${window.location.origin}/login/callback`;
  const logoutRedirectUri = import.meta.env.VITE_OKTA_LOGOUT_REDIRECT_URI || window.location.origin;
  const scopes = (import.meta.env.VITE_OKTA_SCOPES || 'openid profile email').split(' ');
  const responseType = (import.meta.env.VITE_OKTA_RESPONSE_TYPE || 'code') as OAuthResponseType;

  if (!domain || !clientId) {
    throw new Error(
      'OKTA configuration missing. Please ensure VITE_OKTA_DOMAIN and VITE_OKTA_CLIENT_ID are set in your environment variables.'
    );
  }

  return {
    domain,
    clientId,
    redirectUri,
    logoutRedirectUri,
    scopes,
    responseType,
  };
};

export const oktaConfig = getOktaConfig();

export const oktaAuth = new OktaAuth({
  issuer: `https://${oktaConfig.domain}`, // Try without /oauth2/default
  clientId: oktaConfig.clientId,
  redirectUri: oktaConfig.redirectUri,
  scopes: oktaConfig.scopes,
  responseType: oktaConfig.responseType,
  pkce: true,
  devMode: import.meta.env.DEV,
  tokenManager: {
    storage: 'localStorage',
    autoRenew: true,
    secure: !import.meta.env.DEV,
  },
  // Add more detailed error logging
  transformErrorXHR: (xhr: any) => {
    console.error('OKTA Auth Error:', {
      status: xhr.status,
      statusText: xhr.statusText,
      response: xhr.responseText,
      url: xhr.url
    });
    return xhr;
  },
});