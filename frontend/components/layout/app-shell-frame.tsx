"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    AppShell,
    Badge,
    Button,
    Burger,
    Container,
    Group,
    NavLink,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconChartBar,
    IconHomeSearch,
    IconLogout,
    IconPlus,
    IconShieldLock,
    IconUsers,
    IconUserStar,
} from "@tabler/icons-react";
import { api, type AuthRole } from "../../api";
import { useAuthState } from "../../hooks/use-auth-state";

interface AppShellFrameProps {
    title: string;
    description?: string;
    children: ReactNode;
}

interface NavigationItem {
    label: string;
    description: string;
    href: string;
    icon: typeof IconHomeSearch;
}

const adminNavigation: NavigationItem[] = [
    {
        label: "Ricerca",
        description: "Esplora e verifica le inserzioni",
        href: "/search",
        icon: IconHomeSearch,
    },
    {
        label: "Crea admin",
        description: "Registra un nuovo amministratore",
        href: "/admin/users/new",
        icon: IconUsers,
    },
    {
        label: "Crea agente",
        description: "Abilita un nuovo agente",
        href: "/admin/agents/new",
        icon: IconUserStar,
    },
    {
        label: "Cambio password",
        description: "Aggiorna la password dell’admin",
        href: "/admin/password",
        icon: IconShieldLock,
    },
];

const agentNavigation: NavigationItem[] = [
    {
        label: "Ricerca",
        description: "Controlla il catalogo pubblico",
        href: "/search",
        icon: IconHomeSearch,
    },
    {
        label: "Dashboard",
        description: "Numeri e inserzioni gestite",
        href: "/agent/dashboard",
        icon: IconChartBar,
    },
    {
        label: "Nuova inserzione",
        description: "Pubblica un immobile",
        href: "/agent/advertisements/new",
        icon: IconPlus,
    },
];

function navigationForRole(role: AuthRole | null): NavigationItem[] {
    if (role === "admin") {
        return adminNavigation;
    }

    if (role === "agent") {
        return agentNavigation;
    }

    return [];
}

export function AppShellFrame({
    title,
    description,
    children,
}: AppShellFrameProps) {
    const auth = useAuthState();
    const pathname = usePathname();
    const router = useRouter();
    const [opened, { toggle, close }] = useDisclosure(false);
    const navigation = navigationForRole(auth.role);
    const showSidebar = auth.isAuthenticated && navigation.length > 0;

    const handleLogout = () => {
        api.logout();
        router.push("/auth");
    };

    const headerAction = auth.isAuthenticated ? (
        <Group gap="sm">
            <Badge radius="xl" variant="light" size="lg">
                {auth.role ?? "user"}
            </Badge>
            <Button
                variant="light"
                color="dark"
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
            >
                Esci
            </Button>
        </Group>
    ) : (
        <Button component={Link} href="/auth" variant="light">
            Accedi
        </Button>
    );

    return (
        <AppShell
            header={{ height: 84 }}
            navbar={
                showSidebar
                    ? {
                          width: 320,
                          breakpoint: "sm",
                          collapsed: { mobile: !opened },
                      }
                    : undefined
            }
            padding="md"
            styles={{
                main: {
                    background:
                        "radial-gradient(circle at top left, rgba(78, 205, 196, 0.18), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #f4f7fb 100%)",
                    minHeight: "100vh",
                },
            }}
        >
            <AppShell.Header>
                <Container size="xl" h="100%">
                    <Group h="100%" justify="space-between" align="center">
                        <Group gap="sm">
                            {showSidebar ? (
                                <Burger
                                    opened={opened}
                                    onClick={toggle}
                                    hiddenFrom="sm"
                                    size="sm"
                                />
                            ) : null}
                            <Stack gap={0}>
                                <Text
                                    fw={700}
                                    c="dimmed"
                                    tt="uppercase"
                                    fz="xs"
                                >
                                    Dieti Estates 2025
                                </Text>
                                <Title order={3}>{title}</Title>
                            </Stack>
                        </Group>
                        {headerAction}
                    </Group>
                </Container>
            </AppShell.Header>

            {showSidebar ? (
                <AppShell.Navbar p="md">
                    <Stack gap="xs">
                        <Text fw={700} tt="uppercase" fz="xs" c="dimmed">
                            Navigazione
                        </Text>
                        {navigation.map((item) => {
                            const active =
                                pathname === item.href ||
                                pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    label={item.label}
                                    description={item.description}
                                    active={active}
                                    leftSection={<Icon size={18} />}
                                    onClick={close}
                                    variant="filled"
                                    color="teal"
                                    styles={{
                                        root: {
                                            borderRadius: 16,
                                        },
                                    }}
                                />
                            );
                        })}
                    </Stack>
                </AppShell.Navbar>
            ) : null}

            <AppShell.Main>
                <Container size="xl" py="xl">
                    <Stack gap="lg">
                        <Stack gap={4}>
                            <Text c="dimmed" tt="uppercase" fz="xs" fw={700}>
                                {auth.isAuthenticated
                                    ? (auth.role ?? "user autenticato")
                                    : "ospite"}
                            </Text>
                            <Title order={1}>{description ?? title}</Title>
                        </Stack>
                        {children}
                    </Stack>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
