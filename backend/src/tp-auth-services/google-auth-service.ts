
import type { ThirdPartyAuthService } from "../auth/interfaces.js";
import type { ThirdPartyIdentity } from "../auth/data-objects.js";
import { User } from "@dieti-estates-2025/common";
import { authorizationCodeGrant, type Configuration } from 'openid-client';


export class GoogleAuthService implements ThirdPartyAuthService {
  private redirectUri = new URL(`http://${process.env.IP}:${process.env.PORT}/auth/google/callback`);

  constructor(
    private config: Configuration,
    private state: string,
    private codeVerifier: string,
  ) {}

  async authenticateUser(
    authorizationCode: string,
  ): Promise<ThirdPartyIdentity> {
    const tokens = await authorizationCodeGrant(this.config, this.redirectUri, {
      pkceCodeVerifier: this.codeVerifier,
      expectedState: this.state,
    });

    const claims = tokens.claims();

    return {
      provider: 'google',
      sub: claims!.sub,
      user: new User(claims!.email?.toString() ?? "", claims!.name as string),
    };
  }
}
}