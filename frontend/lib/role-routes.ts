import type { AuthRole } from "../api";

export function defaultRouteForRole(role: AuthRole | null): string {
    if (role === "admin") {
        return "/admin/users/new";
    }

    if (role === "agent") {
        return "/agent/dashboard";
    }

    return "/search";
}

export function authRoute(): string {
    return "/auth";
}
