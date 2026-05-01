import 'express-session';

declare module 'express-session' {
  interface SessionData {
    oauthState: string | undefined;
    codeVerifier: string;
    operation: "login" | "signup";
  }
}