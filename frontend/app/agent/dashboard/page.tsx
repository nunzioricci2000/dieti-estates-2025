"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Group,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { IconArrowRight, IconInfoCircle } from "@tabler/icons-react";
import {
    api,
    type AdvertisementDTO,
    type AdvertisementsMetricsDTO,
} from "../../../api";
import { AdvertisementPreviewCard } from "../../../components/advertisements/advertisement-preview-card";
import { AppShellFrame } from "../../../components/layout/app-shell-frame";

function MetricCard({ label, value }: { label: string; value: number }) {
    return (
        <Card withBorder radius="xl" p="lg" shadow="sm">
            <Stack gap={4}>
                <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                    {label}
                </Text>
                <Title order={2}>{value}</Title>
            </Stack>
        </Card>
    );
}

export default function AgentDashboardPage() {
    const [metrics, setMetrics] = useState<AdvertisementsMetricsDTO | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const advertisements = metrics?.advertisements as
        | AdvertisementDTO[]
        | undefined;

    useEffect(() => {
        let active = true;
        setLoading(true);
        setErrorMessage(null);

        api.getAdvertisementsMetrics("metrics")
            .then((data) => {
                if (active) {
                    setMetrics(data);
                }
            })
            .catch((error) => {
                if (active) {
                    setErrorMessage(
                        error instanceof Error
                            ? error.message
                            : "Dashboard non disponibile",
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <AppShellFrame
            title="Dashboard analitiche"
            description="Numeri generali e inserzioni pubblicate dall’agente."
        >
            {errorMessage ? (
                <Alert
                    color="red"
                    title="Errore"
                    icon={<IconInfoCircle size={16} />}
                >
                    {errorMessage}
                </Alert>
            ) : null}

            {loading ? (
                <Text c="dimmed">Caricamento dashboard...</Text>
            ) : metrics ? (
                <Stack gap="xl">
                    <SimpleGrid cols={{ base: 1, md: 3 }}>
                        <MetricCard
                            label="Visite richieste"
                            value={metrics.totalVisitsRequested}
                        />
                        <MetricCard
                            label="Visualizzazioni"
                            value={metrics.totalViews}
                        />
                        <MetricCard
                            label="Inserzioni"
                            value={metrics.advertisements.length}
                        />
                    </SimpleGrid>

                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Title order={3}>Lista degli immobili</Title>
                            <Badge variant="light" color="teal">
                                {metrics.advertisements.length} elementi
                            </Badge>
                        </Group>
                        {advertisements ? (
                            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                                {advertisements.map((advertisement) => (
                                    <AdvertisementPreviewCard
                                        key={advertisement.id}
                                        advertisement={advertisement}
                                        href={`/search/${advertisement.id}`}
                                        actionLabel="Vai a inserzione"
                                        footer={
                                            <Button
                                                component={Link}
                                                href={`/search/${advertisement.id}`}
                                                variant="subtle"
                                                rightSection={
                                                    <IconArrowRight size={16} />
                                                }
                                            >
                                                Apri scheda
                                            </Button>
                                        }
                                    />
                                ))}
                            </SimpleGrid>
                        ) : null}
                    </Stack>
                </Stack>
            ) : null}
        </AppShellFrame>
    );
}
