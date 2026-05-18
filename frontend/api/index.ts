import type {
    AdvertisementDTO,
    AuthResponseDTO,
    LoginRequestDTO,
    PasswordDTO,
    SignupRequestDTO,
    UserDTO,
    AdvertisementsMetricsDTO,
    SendEmailDTO,
} from "./generated";

export type {
    AdvertisementDTO,
    AuthResponseDTO,
    LoginRequestDTO,
    PasswordDTO,
    SignupRequestDTO,
    UserDTO,
    AdvertisementsMetricsDTO,
    SendEmailDTO,
} from "./generated";

const AUTH_STORAGE_KEY = "dieti-estates-2025.auth-token";

export type AuthRole = "user" | "admin" | "agent";

type SignalListener<T> = (value: T) => void;

export interface Signal<T> {
    value: T;
    subscribe(listener: SignalListener<T>): () => void;
}

export interface AuthState {
    token: string | null;
    role: AuthRole | null;
    isAuthenticated: boolean;
}

interface StoredAuthState {
    token: string;
    role: AuthRole | null;
}

export interface SearchAdvertisementsFilters {
    area?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    distance?: number;
    dimensionsMin?: number;
    dimensionsMax?: number;
    numberOfRoomsMin?: number;
    numberOfRoomsMax?: number;
    acceptableEnergyClasses?: string[];
}

export interface ApiRequestContext {
    url: string;
    init: RequestInit;
}

export interface ApiResponseContext<T = unknown> {
    request: ApiRequestContext;
    response: Response;
    data: T;
}

export interface ApiInterceptor {
    onRequest?(
        request: ApiRequestContext,
    ): ApiRequestContext | Promise<ApiRequestContext | void> | void;
    onResponse?<T>(
        response: ApiResponseContext<T>,
    ): ApiResponseContext<T> | Promise<ApiResponseContext<T> | void> | void;
    onError?(error: unknown, request: ApiRequestContext): void | Promise<void>;
}

export interface ApiService {
    auth: Signal<AuthState>;
    login(credentials: LoginRequestDTO): Promise<AuthResponseDTO>;
    signup(credentials: SignupRequestDTO): Promise<AuthResponseDTO>;
    logout(): void;
    registerInterceptor(interceptor: ApiInterceptor): () => void;
    getAdvertisement(id: number): Promise<AdvertisementDTO>;
    searchAndFilterAdvertisements(
        filters?: SearchAdvertisementsFilters,
    ): Promise<AdvertisementDTO[]>;
    getAdvertisementsMetrics(
        include?: string,
    ): Promise<AdvertisementsMetricsDTO>;
    createAdmin(credentials: SignupRequestDTO): Promise<UserDTO>;
    createAgent(credentials: SignupRequestDTO): Promise<UserDTO>;
    changeAdminPassword(password: PasswordDTO): Promise<UserDTO>;
    createAdvertisement(
        advertisement: CreateAdvertisementInput,
    ): Promise<AdvertisementDTO>;
}

export interface CreateAdvertisementInput {
    address: string;
    city: string;
    latitude: string;
    longitude: string;
    images: Array<File | Blob>;
    description: string;
    dimensions: number;
    numberOfRooms: number;
    energyClass: string;
    additionalServices: string[];
    kind: string;
    price: number;
}

class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly payload: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function createSignal<T>(initialValue: T): Signal<T> {
    let currentValue = initialValue;
    const listeners = new Set<SignalListener<T>>();

    return {
        get value() {
            return currentValue;
        },
        set value(nextValue: T) {
            if (Object.is(currentValue, nextValue)) {
                return;
            }

            currentValue = nextValue;
            for (const listener of listeners) {
                listener(currentValue);
            }
        },
        subscribe(listener: SignalListener<T>) {
            listeners.add(listener);
            listener(currentValue);

            return () => {
                listeners.delete(listener);
            };
        },
    };
}

function normalizeRole(value: unknown): AuthRole | null {
    if (value === "admin" || value === "agent" || value === "user") {
        return value;
    }

    return null;
}

function readStoredAuthState(): StoredAuthState | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedValue) {
            return null;
        }

        if (storedValue.startsWith("{")) {
            const parsed = JSON.parse(storedValue) as {
                token?: unknown;
                role?: unknown;
            };

            if (typeof parsed.token === "string" && parsed.token.length > 0) {
                return {
                    token: parsed.token,
                    role: normalizeRole(parsed.role),
                };
            }
        }

        return {
            token: storedValue,
            role: null,
        };
    } catch {
        return null;
    }
}

function storeAuthState(authState: Pick<AuthState, "token" | "role">): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify(authState),
        );
    } catch {
        // Ignore storage errors so API calls still work.
    }
}

function clearStoredAuthState(): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
        // Ignore storage errors so API calls still work.
    }
}

function createHeaders(
    initHeaders: HeadersInit | undefined,
    token: string | null,
): Headers {
    const headers = new Headers(initHeaders);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
}

function normalizeBaseUrl(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

function buildUrl(
    path: string,
    query?: Record<string, string | number | undefined>,
): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    const hasBaseUrl = Boolean(baseUrl);
    const runningInBrowser = typeof window !== "undefined";
    const origin = hasBaseUrl
        ? normalizeBaseUrl(baseUrl as string)
        : runningInBrowser
            ? window.location.origin
            : "http://localhost";

    const url = new URL(path, origin);
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== "") {
                url.searchParams.set(key, String(value));
            }
        }
    }

    return hasBaseUrl || !runningInBrowser
        ? url.toString()
        : `${url.pathname}${url.search}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type") ?? "";

    if (response.status === 204) {
        return undefined as T;
    }

    if (contentType.includes("application/json")) {
        return (await response.json()) as T;
    }

    return (await response.text()) as T;
}

function extractAuthResponse(
    payload: unknown,
    response: Response,
): { token: string; role: AuthRole | null } {
    const responseBody =
        payload && typeof payload === "object" ? payload : undefined;

    if (responseBody && "token" in responseBody) {
        const token = (responseBody as { token?: unknown }).token;
        if (typeof token === "string" && token.length > 0) {
            const role =
                normalizeRole((responseBody as { role?: unknown }).role) ??
                normalizeRole(
                    (responseBody as { user?: { role?: unknown } }).user?.role,
                ) ??
                normalizeRole(
                    (responseBody as { account?: { role?: unknown } }).account
                        ?.role,
                ) ??
                normalizeRole(response.headers.get("x-user-role"));

            return { token, role };
        }
    }

    const authorizationHeader =
        response.headers.get("authorization") ??
        response.headers.get("x-auth-token");
    if (authorizationHeader) {
        return {
            token: authorizationHeader.replace(/^Bearer\s+/i, "").trim(),
            role: normalizeRole(response.headers.get("x-user-role")),
        };
    }

    throw new ApiError(
        "Authentication token was not returned by the backend",
        response.status,
        payload,
    );
}

function createApiService(): ApiService {
    const initialAuthState = readStoredAuthState();
    const auth = createSignal<AuthState>({
        token: initialAuthState?.token ?? null,
        role: initialAuthState?.role ?? null,
        isAuthenticated: Boolean(initialAuthState?.token),
    });
    const interceptors = new Set<ApiInterceptor>();

    const sendRequest = async <T>(
        path: string,
        init: RequestInit = {},
        query?: Record<string, string | number | undefined>,
    ): Promise<{ data: T; response: Response; request: ApiRequestContext }> => {
        const request: ApiRequestContext = {
            url: buildUrl(path, query),
            init: {
                ...init,
                headers: createHeaders(init.headers, auth.value.token),
            },
        };

        for (const interceptor of interceptors) {
            const maybeRequest = await interceptor.onRequest?.(request);
            if (maybeRequest) {
                request.url = maybeRequest.url;
                request.init = maybeRequest.init;
            }
        }

        try {
            const response = await fetch(request.url, request.init);
            const data = await parseResponse<T>(response);

            if (!response.ok) {
                throw new ApiError(
                    `Request failed with status ${response.status}`,
                    response.status,
                    data,
                );
            }

            let context: ApiResponseContext<T> = { request, response, data };
            for (const interceptor of interceptors) {
                const maybeResponse = await interceptor.onResponse?.(context);
                if (maybeResponse) {
                    context = maybeResponse;
                }
            }

            return context;
        } catch (error) {
            for (const interceptor of interceptors) {
                await interceptor.onError?.(error, request);
            }

            throw error;
        }
    };

    return {
        auth,
        async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
            const { data, response } = await sendRequest<
                AuthResponseDTO | unknown
            >("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const authResponse = extractAuthResponse(data, response);
            storeAuthState(authResponse);
            auth.value = {
                token: authResponse.token,
                role: authResponse.role,
                isAuthenticated: true,
            };

            return { token: authResponse.token };
        },
        async signup(credentials: SignupRequestDTO): Promise<AuthResponseDTO> {
            const { data, response } = await sendRequest<
                AuthResponseDTO | unknown
            >("/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const authResponse = extractAuthResponse(data, response);
            storeAuthState(authResponse);
            auth.value = {
                token: authResponse.token,
                role: authResponse.role,
                isAuthenticated: true,
            };

            return { token: authResponse.token };
        },
        logout(): void {
            clearStoredAuthState();
            auth.value = {
                token: null,
                role: null,
                isAuthenticated: false,
            };
        },
        registerInterceptor(interceptor: ApiInterceptor): () => void {
            interceptors.add(interceptor);

            return () => {
                interceptors.delete(interceptor);
            };
        },
        async getAdvertisement(id: number): Promise<AdvertisementDTO> {
            const { data } = await sendRequest<AdvertisementDTO>(
                `/advertisements/${id}`,
                {
                    method: "GET",
                },
            );

            return data;
        },
        async searchAndFilterAdvertisements(
            filters: SearchAdvertisementsFilters = {},
        ): Promise<AdvertisementDTO[]> {
            const query: Record<string, string | number | undefined> = {
                area: filters.area,
                distance: filters.distance,
                latitude: filters.location?.latitude,
                longitude: filters.location?.longitude,
                "max-dimensions": filters.dimensionsMax,
                "min-dimensions": filters.dimensionsMin,
                "number-of-rooms-max": filters.numberOfRoomsMax,
                "number-of-rooms-min": filters.numberOfRoomsMin,
                "acceptable-energy-classes": filters.acceptableEnergyClasses
                    ?.length
                    ? filters.acceptableEnergyClasses.join(",")
                    : undefined,
            };

            const { data } = await sendRequest<AdvertisementDTO[]>(
                "/advertisements",
                {
                    method: "GET",
                },
                query,
            );

            return data;
        },
        async getAdvertisementsMetrics(
            include?: string,
        ): Promise<AdvertisementsMetricsDTO> {
            const { data } = await sendRequest<AdvertisementsMetricsDTO>(
                "/advertisements",
                {
                    method: "GET",
                },
                {
                    include,
                },
            );

            return data;
        },
        async createAdmin(credentials: SignupRequestDTO): Promise<UserDTO> {
            const { data } = await sendRequest<UserDTO>("/admins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            return data;
        },
        async createAgent(credentials: SignupRequestDTO): Promise<UserDTO> {
            const { data } = await sendRequest<UserDTO>("/agents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            return data;
        },
        async changeAdminPassword(password: PasswordDTO): Promise<UserDTO> {
            const { data } = await sendRequest<UserDTO>("/admins/me/password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(password),
            });

            return data;
        },
        async createAdvertisement(
            advertisement: CreateAdvertisementInput,
        ): Promise<AdvertisementDTO> {
            const formData = new FormData();

            formData.append("address", advertisement.address);
            formData.append("city", advertisement.city);
            formData.append("latitude", advertisement.latitude);
            formData.append("longitude", advertisement.longitude);
            for (const image of advertisement.images) {
                formData.append("images", image);
            }
            formData.append("description", advertisement.description);
            formData.append("dimensions", String(advertisement.dimensions));
            formData.append(
                "numberOfRooms",
                String(advertisement.numberOfRooms),
            );
            formData.append("energyClass", advertisement.energyClass);
            for (const service of advertisement.additionalServices) {
                formData.append("additionalServices", service);
            }
            formData.append("kind", advertisement.kind);
            formData.append("price", String(advertisement.price));

            const { data } = await sendRequest<AdvertisementDTO>(
                "/advertisements",
                {
                    method: "POST",
                    body: formData,
                },
            );

            return data;
        },
    };
}

export const api = createApiService();

export default api;
