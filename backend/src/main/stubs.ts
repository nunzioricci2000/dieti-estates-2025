import type {
    Event,
    EventListener,
    EventPublisher,
} from "@dieti-estates-2025/common";
import { User } from "@dieti-estates-2025/common";
import type {
    ThirdPartyAuthService,
    TokenService,
} from "../auth/interfaces.js";
import type { ThirdPartyIdentity } from "../auth/data-objects.js";

const notImplemented = (name: string): never => {
    throw new Error(`${name} is a stub — provide a real implementation`);
};

export class StubEventPublisher implements EventPublisher {
    publish(_event: Event): void { }
    addListener(_listener: EventListener): void { }
}

export class StubThirdPartyAuthService implements ThirdPartyAuthService {
    authenticateUser(_authorizationCode: string): ThirdPartyIdentity {
        return notImplemented("StubThirdPartyAuthService.authenticateUser");
    }
}

