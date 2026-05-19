"use client";

import { Center, Loader, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "../hooks/use-auth-state";
import { defaultRouteForRole } from "../lib/role-routes";

export default function HomePage() {
    const auth = useAuthState();
    const router = useRouter();

    useEffect(() => {
        router.replace(defaultRouteForRole(auth.role));
    }, [auth.role, router]);

    return (
        <Center h="100vh">
            <Stack align="center" gap="sm">
                <Loader size="lg" />
                <Text c="dimmed">Caricamento dell’area corretta...</Text>
            </Stack>
        </Center>
    );
}
