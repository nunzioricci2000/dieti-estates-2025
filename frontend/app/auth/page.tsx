"use client";

import { useEffect, useState } from "react";
import { Button, Card, Group, Stack, Tabs, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { api } from "../../api";
import { IdentityForm } from "../../components/forms/identity-form";
import { useAuthState } from "../../hooks/use-auth-state";
import { defaultRouteForRole } from "../../lib/role-routes";

export default function AuthPage() {
    const auth = useAuthState();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>("login");

    useEffect(() => {
        if (auth.isAuthenticated) {
            router.replace(defaultRouteForRole(auth.role));
        }
    }, [auth.isAuthenticated, auth.role, router]);

    const handleLogin = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        await api.login({ email, password });
        router.replace(defaultRouteForRole(api.auth.value.role));
    };

    const handleSignup = async ({
        username,
        email,
        password,
    }: {
        username?: string;
        email: string;
        password: string;
    }) => {
        if (!username) {
            throw new Error("Username mancante");
        }

        await api.signup({ username, email, password });
        router.replace(defaultRouteForRole(api.auth.value.role));
    };

    return (
        <Card
            radius="xl"
            shadow="xl"
            withBorder
            mx="auto"
            my="xl"
            p="xl"
            style={{ maxWidth: 760 }}
        >
            <Stack gap="lg">
                <Stack gap={4}>
                    <Text c="teal" fw={700} tt="uppercase" fz="xs">
                        Accesso
                    </Text>
                    <Title order={1}>Entra nel portale</Title>
                    <Text c="dimmed">
                        Usa le credenziali esistenti oppure crea un nuovo
                        account.
                    </Text>
                </Stack>

                <Tabs value={activeTab} onChange={setActiveTab} variant="pills">
                    <Tabs.List>
                        <Tabs.Tab value="login">Login</Tabs.Tab>
                        <Tabs.Tab value="signup">Registrazione</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="login" pt="md">
                        <IdentityForm
                            title="Login"
                            description="Accedi con email e password."
                            submitLabel="Entra"
                            onSubmit={({ email, password }) =>
                                handleLogin({ email, password })
                            }
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="signup" pt="md">
                        <IdentityForm
                            title="Nuovo account"
                            description="Crea un account utente standard."
                            submitLabel="Crea account"
                            showUsername
                            onSubmit={({ username, email, password }) =>
                                handleSignup({ username, email, password })
                            }
                        />
                    </Tabs.Panel>
                </Tabs>

                <Group justify="space-between">
                    <Text c="dimmed" size="sm">
                        Se hai già effettuato l’accesso, puoi tornare alla vista
                        corretta.
                    </Text>
                    <Button
                        variant="light"
                        onClick={() =>
                            router.replace(defaultRouteForRole(auth.role))
                        }
                    >
                        Vai alla home
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}
