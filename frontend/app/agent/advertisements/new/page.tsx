"use client";

import { useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Group,
    NumberInput,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { api, type CreateAdvertisementInput } from "../../../../api";
import { AppShellFrame } from "../../../../components/layout/app-shell-frame";

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

export default function NewAdvertisementPage() {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [dimensions, setDimensions] = useState<number | string>("");
    const [numberOfRooms, setNumberOfRooms] = useState<number | string>("");
    const [energyClass, setEnergyClass] = useState<string | null>("A4");
    const [additionalServices, setAdditionalServices] = useState("");
    const [kind, setKind] = useState<string | null>("sale");
    const [price, setPrice] = useState<number | string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const parsedServices = useMemo(
        () =>
            additionalServices
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
        [additionalServices],
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        const payload: CreateAdvertisementInput = {
            address,
            city,
            latitude,
            longitude,
            images: files,
            description,
            dimensions: Number(dimensions),
            numberOfRooms: Number(numberOfRooms),
            energyClass: energyClass ?? "A4",
            additionalServices: parsedServices,
            kind: kind ?? "sale",
            price: Number(price),
        };

        try {
            const created = await api.createAdvertisement(payload);
            setSuccessMessage(`Inserzione #${created.id} creata con successo`);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Creazione non riuscita",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShellFrame
            title="Creazione inserzione"
            description="Pubblica un nuovo immobile con immagini e parametri completi."
        >
            {successMessage ? (
                <Alert
                    color="green"
                    title="Completato"
                    icon={<IconCheck size={16} />}
                >
                    {successMessage}
                </Alert>
            ) : null}
            {errorMessage ? (
                <Alert
                    color="red"
                    title="Errore"
                    icon={<IconInfoCircle size={16} />}
                >
                    {errorMessage}
                </Alert>
            ) : (
                <Alert
                    color="blue"
                    title="Informazione"
                    icon={<IconInfoCircle size={16} />}
                >
                    Il form usa il servizio API già presente e invia il payload
                    in multipart.
                </Alert>
            )}

            <Paper withBorder radius="xl" p="xl" shadow="sm">
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                            <TextInput
                                label="Indirizzo"
                                value={address}
                                onChange={(event) =>
                                    setAddress(event.currentTarget.value)
                                }
                                required
                            />
                            <TextInput
                                label="Città"
                                value={city}
                                onChange={(event) =>
                                    setCity(event.currentTarget.value)
                                }
                                required
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                            <TextInput
                                label="Latitudine"
                                value={latitude}
                                onChange={(event) =>
                                    setLatitude(event.currentTarget.value)
                                }
                                required
                            />
                            <TextInput
                                label="Longitudine"
                                value={longitude}
                                onChange={(event) =>
                                    setLongitude(event.currentTarget.value)
                                }
                                required
                            />
                        </SimpleGrid>
                        <Textarea
                            label="Descrizione"
                            autosize
                            minRows={4}
                            value={description}
                            onChange={(event) =>
                                setDescription(event.currentTarget.value)
                            }
                            required
                        />
                        <SimpleGrid cols={{ base: 1, md: 3 }}>
                            <NumberInput
                                label="Mq"
                                value={dimensions}
                                onChange={setDimensions}
                                min={1}
                                required
                            />
                            <NumberInput
                                label="Vani"
                                value={numberOfRooms}
                                onChange={setNumberOfRooms}
                                min={1}
                                required
                            />
                            <NumberInput
                                label="Prezzo"
                                value={price}
                                onChange={setPrice}
                                min={1}
                                required
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                            <Select
                                label="Classe energetica"
                                data={energyClassOptions}
                                value={energyClass}
                                onChange={setEnergyClass}
                                required
                            />
                            <Select
                                label="Tipologia"
                                data={[
                                    { value: "sale", label: "Vendita" },
                                    { value: "rent", label: "Affitto" },
                                ]}
                                value={kind}
                                onChange={setKind}
                                required
                            />
                        </SimpleGrid>
                        <TextInput
                            label="Servizi aggiuntivi"
                            placeholder="garage, ascensore, balcone"
                            value={additionalServices}
                            onChange={(event) =>
                                setAdditionalServices(event.currentTarget.value)
                            }
                        />
                        <Card withBorder radius="lg" p="md">
                            <Stack gap="xs">
                                <Text fw={600}>Immagini</Text>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(event) =>
                                        setFiles(
                                            Array.from(
                                                event.currentTarget.files ?? [],
                                            ),
                                        )
                                    }
                                />
                            </Stack>
                        </Card>
                        <Group justify="space-between">
                            <Text c="dimmed" size="sm">
                                {files.length > 0
                                    ? `${files.length} file selezionati`
                                    : "Nessun file selezionato"}
                            </Text>
                            <Button type="submit" loading={loading}>
                                Crea inserzione
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AppShellFrame>
    );
}
