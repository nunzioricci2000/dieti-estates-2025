"use client";

import {
    AppShell,
    Group,
    Burger,
    Stack,
    NavLink,
    useMatches,
    Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { IconHome, IconLogout, IconUser, IconBuilding, IconChartBar } from "@tabler/icons-react";

interface NavigationProps {
    children: React.ReactNode;
    userRole?: "admin" | "agent" | "user";
}

export function Navigation({ children, userRole }: NavigationProps) {
    const [opened, { toggle, close }] = useDisclosure();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        router.push("/login");
    };

    const isActive = (href: string) => pathname === href;

    const navItems = [
        { label: "Home", href: "/", icon: IconHome },
        { label: "Browse Properties", href: "/properties", icon: IconBuilding },
        { label: "Profile", href: "/profile", icon: IconUser },
        ...(userRole === "agent"
            ? [{ label: "Dashboard", href: "/agent/dashboard", icon: IconChartBar }]
            : []),
        ...(userRole === "admin"
            ? [{ label: "Admin Panel", href: "/admin", icon: IconChartBar }]
            : []),
    ];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <strong>DietiEstates25</strong>
                        </Link>
                    </Group>
                    <Group gap={0} visibleFrom="sm">
                        <ColorSchemeToggle />
                        {userRole && (
                            <NavLink
                                label="Logout"
                                icon={<IconLogout size={16} />}
                                onClick={handleLogout}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar>
                <Stack>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            label={item.label}
                            icon={<item.icon size={16} />}
                            active={isActive(item.href)}
                            component={Link}
                            href={item.href}
                            onClick={close}
                        />
                    ))}
                    <NavLink
                        label="Logout"
                        icon={<IconLogout size={16} />}
                        onClick={handleLogout}
                        style={{ cursor: "pointer" }}
                        hiddenFrom="sm"
                    />
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
