import type {
    Coordinates,
    Event,
    EventListener,
    EventPublisher,
} from "@dieti-estates-2025/common";
import { User } from "@dieti-estates-2025/common";
import type {
    HashService,
    ThirdPartyAuthService,
    TokenService,
} from "../auth/interfaces.js";
import type {
    FirstAdminConfig,
    FirstLaunchDetector,
} from "../admin/interfaces.js";
import type {
    CreateNewAdvertisementPresenter,
    DetectPOIsService,
    RetrieveAdvertisementsMetricsPresenter,
} from "../dashboard/interfaces.js";
import type { AdvertisementsMetrics } from "../dashboard/data-objects.js";
import type { Advertisement } from "@dieti-estates-2025/common";

const notImplemented = (name: string): never => {
    throw new Error(`${name} is a stub — provide a real implementation`);
};

export class StubTokenService implements TokenService {
    generateToken(user: User): string {
        const payload = { email: user.email, username: user.username };
        return Buffer.from(JSON.stringify(payload)).toString("base64");
    }
    verifyToken(token: string): User {
        try {
            const decoded = Buffer.from(token, "base64").toString("utf8");
            const obj = JSON.parse(decoded);
            return new User(obj.email, obj.username);
        } catch (e) {
            return notImplemented("StubTokenService.verifyToken");
        }
    }
}

export class StubHashService implements HashService {
    hashString(value: string): string {
        return value;
    }
    verifyString(value: string, hash: string): boolean {
        return value === hash;
    }
}

export class StubThirdPartyAuthService implements ThirdPartyAuthService {
    usernameFor(_authorizationCode: string): string {
        return notImplemented("StubThirdPartyAuthService.usernameFor");
    }
}

export class StubEventPublisher implements EventPublisher {
    publish(_event: Event): void { }
    addListener(_listener: EventListener): void { }
}

export class StubDetectPOIsService implements DetectPOIsService {
    detectPOIs(_location: Coordinates): string[] {
        return [];
    }
}

export class StubCreateNewAdvertisementPresenter implements CreateNewAdvertisementPresenter {
    present(_advertisement: Advertisement): void {
        notImplemented("StubCreateNewAdvertisementPresenter.present");
    }
    presentError(_error: Error): void {
        notImplemented("StubCreateNewAdvertisementPresenter.presentError");
    }
}

export class StubRetrieveAdvertisementsMetricsPresenter implements RetrieveAdvertisementsMetricsPresenter {
    present(_data: AdvertisementsMetrics): void {
        notImplemented("StubRetrieveAdvertisementsMetricsPresenter.present");
    }
    presentError(_error: Error): void {
        notImplemented(
            "StubRetrieveAdvertisementsMetricsPresenter.presentError",
        );
    }
}
