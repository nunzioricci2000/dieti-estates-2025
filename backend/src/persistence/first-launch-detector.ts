import type { FirstLaunchDetector } from "../admin/interfaces.js";

export class AdminCounterFirstLaunchDetector implements FirstLaunchDetector {
    constructor(private readonly adminCounter: AdminCounter) { }

    async isFirstLaunch(): Promise<boolean> {
        return (await this.adminCounter.countAdmins()) === 0;
    }
}

export interface AdminCounter {
    countAdmins(): Promise<number>;
}
