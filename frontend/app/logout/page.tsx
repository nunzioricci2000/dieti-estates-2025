"use client";

import { Center, Loader, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../api";
import { useAuthState } from "../../hooks/use-auth-state";

export default function LogoutPage() {
    const auth = useAuthState();
    const router = useRouter();

    useEffect(() => {
        api.logout();
        router.replace("/auth");
    }, [router]);

    return (
        <Center h="100vh">
            <Stack align="center" gap="sm">
                <Loader size="lg" />
                <Title order={2}>Uscita in corso</Title>
                <Text c="dimmed">
                    {auth.isAuthenticated
                        ? "Stiamo chiudendo la sessione."
                        : "Reindirizzamento alla schermata di accesso."}
                </Text>
            </Stack>
        </Center>
    );
}
