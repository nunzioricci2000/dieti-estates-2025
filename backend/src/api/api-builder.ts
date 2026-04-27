import type { API } from "./api.js";

export interface APIBuilder<T extends API> {
    buildAuthRouter(): void;
    buildAdvertisementRouter(): void;
    buildAdminRouter(): void;
    buildAgentRouter(): void;
    getResult(): T;
}

export class APIBuilderDirector {
    makeAPI<T extends API>(builder: APIBuilder<T>): T {
        builder.buildAuthRouter();
        builder.buildAdvertisementRouter();
        builder.buildAdminRouter();
        builder.buildAgentRouter();
        return builder.getResult();
    }
}
