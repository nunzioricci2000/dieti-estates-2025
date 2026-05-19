"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Grid,
    Group,
    Image,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { IconInfoCircle, IconMessage, IconCalendar } from "@tabler/icons-react";
import { api, type AdvertisementDTO } from "../../../api";
import { AppShellFrame } from "../../../components/layout/app-shell-frame";
import { useAuthState } from "../../../hooks/use-auth-state";

function formatPrice(price: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(price);
}

function buildMailtoLink(
    advertisement: AdvertisementDTO,
    purpose: string,
): string {
    const subject = `${purpose} - ${advertisement.address}, ${advertisement.city}`;
    const body = [
        `${purpose} per l’inserzione #${advertisement.id}`,
        `${advertisement.address}, ${advertisement.city}`,
        `Prezzo: ${formatPrice(advertisement.price)}`,
        `Superficie: ${advertisement.dimensions} mq`,
        `Vani: ${advertisement.numberOfRooms}`,
        "",
        "Scrivimi per ricevere i prossimi passi.",
    ].join("\n");

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function AdvertisementDetailsPage() {
    const params = useParams<{ id: string }>();
    const auth = useAuthState();
    const [advertisement, setAdvertisement] = useState<AdvertisementDTO | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const id = useMemo(() => Number(params.id), [params.id]);
    const coordinates = advertisement
        ? (advertisement.coordinates as {
              latitude: number;
              longitude: number;
          })
        : null;

    useEffect(() => {
        if (!Number.isFinite(id)) {
            setErrorMessage("ID inserzione non valido");
            setLoading(false);
            return;
        }

        let active = true;
        setLoading(true);
        setErrorMessage(null);

        api.getAdvertisement(id)
            .then((data) => {
                if (active) {
                    setAdvertisement(data);
                }
            })
            .catch((error) => {
                if (active) {
                    setErrorMessage(
                        error instanceof Error
                            ? error.message
                            : "Dettaglio non disponibile",
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
    }, [id]);

    const canContactAgent = auth.isAuthenticated && auth.role === "user";

    return (
        <AppShellFrame
            title="Dettagli inserzione"
            description="Scheda completa dell’immobile selezionato."
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
                <Text c="dimmed">Caricamento dettaglio...</Text>
            ) : advertisement ? (
                <Grid>
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Stack gap="md">
                            <Paper withBorder radius="xl" p={0} shadow="sm">
                                {advertisement.images.length > 0 ? (
                                    <Image
                                        src={advertisement.images[0]}
                                        alt={advertisement.address}
                                        radius="xl"
                                    />
                                ) : (
                                    <div
                                        style={{
                                            minHeight: 360,
                                            background:
                                                "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 118, 110, 0.7))",
                                        }}
                                    />
                                )}
                            </Paper>

                            <Paper withBorder radius="xl" p="lg" shadow="sm">
                                <Stack gap="md">
                                    <Group
                                        justify="space-between"
                                        align="start"
                                    >
                                        <Stack gap={4}>
                                            <Title order={2}>
                                                {advertisement.address}
                                            </Title>
                                            <Text c="dimmed">
                                                {advertisement.city}
                                            </Text>
                                        </Stack>
                                        <Badge variant="light" color="teal">
                                            {advertisement.kind}
                                        </Badge>
                                    </Group>
                                    <Text>{advertisement.description}</Text>
                                    <Group gap="xs">
                                        <Badge variant="outline">
                                            {advertisement.numberOfRooms} vani
                                        </Badge>
                                        <Badge variant="outline">
                                            {advertisement.dimensions} mq
                                        </Badge>
                                        <Badge variant="outline">
                                            Classe {advertisement.energyClass}
                                        </Badge>
                                        <Badge variant="outline">
                                            {formatPrice(advertisement.price)}
                                        </Badge>
                                    </Group>
                                    <Group gap="xs">
                                        {advertisement.additionalServices.map(
                                            (service) => (
                                                <Badge
                                                    key={service}
                                                    variant="light"
                                                    color="gray"
                                                >
                                                    {service}
                                                </Badge>
                                            ),
                                        )}
                                    </Group>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Stack gap="md">
                            <Paper withBorder radius="xl" p="lg" shadow="sm">
                                <Stack gap="sm">
                                    <Title order={3}>Azioni</Title>
                                    {canContactAgent ? (
                                        <>
                                            <Button
                                                component="a"
                                                href={buildMailtoLink(
                                                    advertisement,
                                                    "Richiesta prenotazione",
                                                )}
                                                leftSection={
                                                    <IconCalendar size={16} />
                                                }
                                                fullWidth
                                            >
                                                Prenota visita
                                            </Button>
                                            <Button
                                                component="a"
                                                href={buildMailtoLink(
                                                    advertisement,
                                                    "Proposta offerta",
                                                )}
                                                leftSection={
                                                    <IconMessage size={16} />
                                                }
                                                variant="light"
                                                fullWidth
                                            >
                                                Invia offerta
                                            </Button>
                                        </>
                                    ) : (
                                        <Alert
                                            color="blue"
                                            title="Accesso richiesto"
                                            icon={<IconInfoCircle size={16} />}
                                        >
                                            Le azioni di prenotazione e offerta
                                            sono disponibili per l’utente
                                            semplice autenticato.
                                            <Group mt="sm">
                                                <Button
                                                    component={Link}
                                                    href="/auth"
                                                    variant="light"
                                                >
                                                    Accedi
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    href="/search"
                                                    variant="subtle"
                                                >
                                                    Torna alla ricerca
                                                </Button>
                                            </Group>
                                        </Alert>
                                    )}
                                </Stack>
                            </Paper>

                            <Paper withBorder radius="xl" p="lg" shadow="sm">
                                <Stack gap="sm">
                                    <Title order={4}>Coordinate</Title>
                                    {coordinates ? (
                                        <>
                                            <Text c="dimmed">
                                                Latitudine:{" "}
                                                {coordinates.latitude}
                                            </Text>
                                            <Text c="dimmed">
                                                Longitudine:{" "}
                                                {coordinates.longitude}
                                            </Text>
                                            <Text c="dimmed">
                                                POI vicini:{" "}
                                                {advertisement.nearbyPOIs
                                                    .length > 0
                                                    ? advertisement.nearbyPOIs.join(
                                                          ", ",
                                                      )
                                                    : "non disponibili"}
                                            </Text>
                                        </>
                                    ) : null}
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            ) : null}
        </AppShellFrame>
    );
}
