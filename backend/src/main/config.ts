import type { FirstAdminConfig } from "../admin/interfaces.js";

export class Config implements FirstAdminConfig {
    getEmail(): string {
        return process.env.FIRST_ADMIN_EMAIL || "admin@admin.com";
    }
    getUsername(): string {
        return process.env.FIRST_ADMIN_USERNAME || "admin";
    }
    getPassword(): string {
        return process.env.FIRST_ADMIN_PASSWORD || "admin";
    }
}
