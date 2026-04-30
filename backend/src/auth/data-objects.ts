import { User } from "@dieti-estates-2025/common"

export type ThirdPartyIdentity  = {
    user: User;
    sub: string;
    provider: string;
}