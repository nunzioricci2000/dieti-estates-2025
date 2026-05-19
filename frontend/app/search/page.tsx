"use client";

import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Grid,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { IconInfoCircle, IconSearch } from "@tabler/icons-react";
import {
    api,
    type AdvertisementDTO,
    type SearchAdvertisementsFilters,
} from "../../api";
import { AdvertisementPreviewCard } from "../../components/advertisements/advertisement-preview-card";
import { AppShellFrame } from "../../components/layout/app-shell-frame";

const energyClassOptions = [
    "A4",
    "A3",
    "A2",
    "A1",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
].map((value) => ({ value, label: value }));

function toNumber(value: string): number | undefined {
    if (value.trim() === "") {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

export default function SearchPage() {
    const [area, setArea] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [distance, setDistance] = useState("");
    const [dimensionsMin, setDimensionsMin] = useState("");
    const [dimensionsMax, setDimensionsMax] = useState("");
    const [numberOfRoomsMin, setNumberOfRoomsMin] = useState("");
    const [numberOfRoomsMax, setNumberOfRoomsMax] = useState("");
    const [acceptableEnergyClasses, setAcceptableEnergyClasses] = useState<
        string[]
    >([]);
    const [results, setResults] = useState<AdvertisementDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadResults = async (filters: SearchAdvertisementsFilters) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const advertisements =
                await api.searchAndFilterAdvertisements(filters);
            setResults(advertisements);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Ricerca non riuscita",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadResults({});
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const parsedLatitude = toNumber(latitude);
        const parsedLongitude = toNumber(longitude);

        await loadResults({
            area: area.trim() || undefined,
            location:
                parsedLatitude !== undefined && parsedLongitude !== undefined
                    ? {
                          latitude: parsedLatitude,
                          longitude: parsedLongitude,
                      }
                    : undefined,
            distance: toNumber(distance),
            dimensionsMin: toNumber(dimensionsMin),
            dimensionsMax: toNumber(dimensionsMax),
            numberOfRoomsMin: toNumber(numberOfRoomsMin),
            numberOfRoomsMax: toNumber(numberOfRoomsMax),
            acceptableEnergyClasses: acceptableEnergyClasses.length
                ? acceptableEnergyClasses
                : undefined,
        });
    };

    return (
        <AppShellFrame
            title="Ricerca"
            description="Cerca annunci, filtra i parametri e apri il dettaglio dell’inserzione."
        >
            <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper withBorder radius="xl" p="lg" shadow="sm">
                        <Stack gap="md">
                            <Title order={3}>Parametri di ricerca</Title>
                            <Text c="dimmed" size="sm">
                                Usa area, coordinate e caratteristiche
                                immobiliari.
                            </Text>
                            {errorMessage ? (
                                <Alert
                                    color="red"
                                    title="Errore"
                                    icon={<IconInfoCircle size={16} />}
                                >
                                    {errorMessage}
                                </Alert>
                            ) : null}
                            <form onSubmit={handleSubmit}>
                                <Stack gap="md">
                                    <TextInput
                                        label="Area / città"
                                        placeholder="Milano"
                                        value={area}
                                        onChange={(event) =>
                                            setArea(event.currentTarget.value)
                                        }
                                    />
                                    <SimpleGrid cols={2} spacing="sm">
                                        <TextInput
                                            label="Latitudine"
                                            placeholder="45.4642"
                                            value={latitude}
                                            onChange={(event) =>
                                                setLatitude(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                        <TextInput
                                            label="Longitudine"
                                            placeholder="9.1900"
                                            value={longitude}
                                            onChange={(event) =>
                                                setLongitude(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </SimpleGrid>
                                    <SimpleGrid cols={2} spacing="sm">
                                        <TextInput
                                            label="Distanza"
                                            placeholder="5000"
                                            value={distance}
                                            onChange={(event) =>
                                                setDistance(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                        <TextInput
                                            label="Classe energetica"
                                            placeholder="A4, B"
                                            value={acceptableEnergyClasses.join(
                                                ", ",
                                            )}
                                            onChange={(event) =>
                                                setAcceptableEnergyClasses(
                                                    event.currentTarget.value
                                                        .split(",")
                                                        .map((value) =>
                                                            value.trim(),
                                                        )
                                                        .filter(Boolean),
                                                )
                                            }
                                        />
                                    </SimpleGrid>
                                    <SimpleGrid cols={2} spacing="sm">
                                        <TextInput
                                            label="Mq min"
                                            placeholder="50"
                                            value={dimensionsMin}
                                            onChange={(event) =>
                                                setDimensionsMin(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                        <TextInput
                                            label="Mq max"
                                            placeholder="180"
                                            value={dimensionsMax}
                                            onChange={(event) =>
                                                setDimensionsMax(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </SimpleGrid>
                                    <SimpleGrid cols={2} spacing="sm">
                                        <TextInput
                                            label="Vani min"
                                            placeholder="2"
                                            value={numberOfRoomsMin}
                                            onChange={(event) =>
                                                setNumberOfRoomsMin(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                        <TextInput
                                            label="Vani max"
                                            placeholder="6"
                                            value={numberOfRoomsMax}
                                            onChange={(event) =>
                                                setNumberOfRoomsMax(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </SimpleGrid>
                                    <Button
                                        type="submit"
                                        leftSection={<IconSearch size={16} />}
                                        loading={loading}
                                    >
                                        Cerca
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Title order={3}>Lista risultati</Title>
                            <Text c="dimmed">
                                {results.length} inserzioni trovate
                            </Text>
                        </Group>
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                            {results.map((advertisement) => (
                                <AdvertisementPreviewCard
                                    key={advertisement.id}
                                    advertisement={advertisement}
                                    href={`/search/${advertisement.id}`}
                                />
                            ))}
                        </SimpleGrid>
                        {!loading && results.length === 0 ? (
                            <Alert
                                color="blue"
                                title="Nessun risultato"
                                icon={<IconInfoCircle size={16} />}
                            >
                                Prova a cambiare i filtri di ricerca.
                            </Alert>
                        ) : null}
                    </Stack>
                </Grid.Col>
            </Grid>
        </AppShellFrame>
    );
}
