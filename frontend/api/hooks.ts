import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./apiFetcher";
import type {
    SignupRequestDTO,
    PasswordDTO,
    AuthResponseDTO,
    UserDTO,
    AdvertisementsMetricsDTO,
    AdvertisementDTO,
} from "./apiSchemas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Helper to get auth token
const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
};

// Auth hooks
export const useSignup = () => {
    return useMutation({
        mutationFn: async (data: SignupRequestDTO) => {
            const response = await apiFetch<AuthResponseDTO>({
                url: `${API_BASE_URL}/auth/signup`,
                method: "POST",
                body: data,
                headers: {
                    Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : undefined,
                },
            });
            return response;
        },
    });
};

export const useReAuthenticate = () => {
    return useMutation({
        mutationFn: async (data: PasswordDTO) => {
            const response = await apiFetch<AuthResponseDTO>({
                url: `${API_BASE_URL}/auth/re-authenticate`,
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response;
        },
    });
};

// Admin hooks
export const useCreateAdmin = () => {
    return useMutation({
        mutationFn: async (data: SignupRequestDTO) => {
            const response = await apiFetch<UserDTO>({
                url: `${API_BASE_URL}/admins`,
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response;
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (data: PasswordDTO) => {
            const response = await apiFetch<UserDTO>({
                url: `${API_BASE_URL}/admins/me/password`,
                method: "PATCH",
                body: data,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response;
        },
    });
};

// Agent hooks
export const useCreateAgent = () => {
    return useMutation({
        mutationFn: async (data: SignupRequestDTO) => {
            const response = await apiFetch<UserDTO>({
                url: `${API_BASE_URL}/agents`,
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response;
        },
    });
};

// Advertisement hooks
export const useAdvertisementMetrics = () => {
    return useQuery({
        queryKey: ["advertisements", "metrics"],
        queryFn: async () => {
            const response = await apiFetch<AdvertisementsMetricsDTO>({
                url: `${API_BASE_URL}/advertisements?include=metrics`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response;
        },
    });
};

export const useCreateAdvertisement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${API_BASE_URL}/advertisements`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return response.json() as Promise<AdvertisementDTO>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["advertisements", "metrics"] });
        },
    });
};

export const useSetAdvertisementTaken = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, taken }: { id: number; taken: boolean }) => {
            const response = await apiFetch<AdvertisementDTO>({
                url: `${API_BASE_URL}/advertisements/${id}`,
                method: "PATCH",
                body: { taken },
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["advertisements"] });
        },
    });
};

export const useCreateOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await apiFetch({
                url: `${API_BASE_URL}/advertisements/${id}/offers`,
                method: "POST",
                body: {},
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["advertisements"] });
        },
    });
};
