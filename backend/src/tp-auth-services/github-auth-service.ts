import { User } from "@dieti-estates-2025/common";
import type { ThirdPartyIdentity } from "../auth/data-objects.js";
import type { ThirdPartyAuthService } from "../auth/interfaces.js";

export class GithubAuthService implements ThirdPartyAuthService {
    // Github does not fully conform to OpenID connect
    private async exchangeCodeForToken(code: string): Promise<string> {
        const res = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            }),
        });

        const data = await res.json();
        return data.access_token;
    }

    private async fetchGithubUser(token: string) {
        const res = await fetch("https://api.github.com/user", {
            headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": `${process.env.APP_NAME}`,
            },
        });

        return res.json();
    }

    private async fetchGithubEmail(token: string): Promise<string | undefined> {
    const res = await fetch("https://api.github.com/user/emails", {
        headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": `${process.env.APP_NAME}`,
        },
    });

    const emails: { email: string; primary: boolean; verified: boolean }[] = await res.json();
    return emails.find(e => e.primary && e.verified)?.email;
    }

    async authenticateUser(code: string): Promise<ThirdPartyIdentity> {
    const token = await this.exchangeCodeForToken(code);
    const [profile, email] = await Promise.all([
        this.fetchGithubUser(token),
        this.fetchGithubEmail(token),
    ]);

    return {
        provider: 'github',
        sub: profile.id.toString(),
        user: new User(email ?? "", profile.login),
    };
    }
}