"use client";

import {
    Container,
    Grid,
    Card,
    Image,
    Badge,
    Text,
    Button,
    Stack,
    Group,
    TextInput,
    NumberInput,
    Select,
    Checkbox,
    SimpleGrid,
    Title,
    Tabs,
    Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAdvertisementMetrics } from "@/api/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconAlertCircle, IconSearch, IconMapPin, IconDoorOpen } from "@tabler/icons-react";
import { Navigation } from "@/components/Navigation/Navigation";

export default function PropertiesPage() {
    const router = useRouter();
    const { data: metricsData, isLoading, error } = useAdvertisementMetrics();
    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);

    const form = useForm({
        initialValues: {
            city: "",
            priceMin: 0,
            priceMax: 1000000,
            rooms: 0,
            energyClass: "",
            kind: "all",
        },
    });

    const handleSearch = (values: typeof form.values) => {
        if (!metricsData?.advertisements) return;

        const filtered = metricsData.advertisements.filter((property: any) => {
            const matchCity = !values.city || property.city.toLowerCase().includes(values.city.toLowerCase());
            const matchPrice =
                property.price >= values.priceMin && property.price <= values.priceMax;
            const matchRooms = values.rooms === 0 || property.numberOfRooms === values.rooms;
            const matchEnergy =
                !values.energyClass || property.energyClass === values.energyClass;
            const matchKind = values.kind === "all" || property.kind === values.kind;

            return matchCity && matchPrice && matchRooms && matchEnergy && matchKind;
        });

        setFilteredProperties(filtered);
    };

    return (
        <Navigation userRole="user">
            <Container size="xl">
                <Title mb="xl">Browse Properties</Title>

                {error && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                        Failed to load properties. Please try again later.
                    </Alert>
                )}

                <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                Filters
                            </Title>
                            <form
                                onSubmit={form.onSubmit((values) => {
                                    handleSearch(values);
                                })}
                            >
                                <Stack gap="md">
                                    <TextInput
                                        label="City"
                                        placeholder="Search by city"
                                        icon={<IconMapPin size={14} />}
                                        {...form.getInputProps("city")}
                                    />

                                    <NumberInput
                                        label="Min Price"
                                        placeholder="0"
                                        {...form.getInputProps("priceMin")}
                                    />

                                    <NumberInput
                                        label="Max Price"
                                        placeholder="1000000"
                                        {...form.getInputProps("priceMax")}
                                    />

                                    <NumberInput
                                        label="Number of Rooms"
                                        placeholder="0 = All"
                                        {...form.getInputProps("rooms")}
                                    />

                                    <Select
                                        label="Type"
                                        placeholder="All"
                                        data={[
                                            { value: "all", label: "All" },
                                            { value: "sale", label: "For Sale" },
                                            { value: "rent", label: "For Rent" },
                                        ]}
                                        {...form.getInputProps("kind")}
                                    />

                                    <Select
                                        label="Energy Class"
                                        placeholder="Any"
                                        data={[
                                            { value: "", label: "Any" },
                                            { value: "A", label: "Class A" },
                                            { value: "B", label: "Class B" },
                                            { value: "C", label: "Class C" },
                                            { value: "D", label: "Class D" },
                                        ]}
                                        {...form.getInputProps("energyClass")}
                                    />

                                    <Button fullWidth type="submit">
                                        Search
                                    </Button>
                                </Stack>
                            </form>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 8 }}>
                        {isLoading ? (
                            <Card withBorder p="lg">
                                <Text>Loading properties...</Text>
                            </Card>
                        ) : (
                            <Stack gap="md">
                                <Text c="dimmed">
                                    {filteredProperties.length || metricsData?.advertisements?.length || 0} properties found
                                </Text>
                                <SimpleGrid cols={{ base: 1 }} spacing="md">
                                    {(filteredProperties.length > 0
                                        ? filteredProperties
                                        : metricsData?.advertisements || []
                                    ).map((property: any) => (
                                        <Card key={property.id} withBorder>
                                            <Card.Section>
                                                {property.images && property.images.length > 0 ? (
                                                    <Image src={property.images[0]} alt={property.address} height={200} />
                                                ) : (
                                                    <div style={{ height: 200, backgroundColor: "#f0f0f0" }} />
                                                )}
                                            </Card.Section>

                                            <Group justify="space-between" mt="md" mb="md">
                                                <div>
                                                    <Text fw={500}>{property.address}</Text>
                                                    <Text size="sm" c="dimmed">
                                                        {property.city}
                                                    </Text>
                                                </div>
                                                <Badge>{property.kind === "sale" ? "For Sale" : "For Rent"}</Badge>
                                            </Group>

                                            <Group gap="xs" mb="md">
                                                <Badge size="lg" variant="light">
                                                    {property.price.toLocaleString()}€
                                                </Badge>
                                                <Badge size="sm" variant="light">
                                                    {property.numberOfRooms} <IconDoorOpen size={12} /> rooms
                                                </Badge>
                                                <Badge size="sm" variant="light">
                                                    {property.dimensions}m²
                                                </Badge>
                                                <Badge size="sm" variant="light">
                                                    {property.energyClass}
                                                </Badge>
                                            </Group>

                                            <Text size="sm" mb="md" lineClamp={2}>
                                                {property.description}
                                            </Text>

                                            <Group>
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.push(`/properties/${property.id}`)}
                                                >
                                                    View Details
                                                </Button>
                                                <Button size="sm" variant="light">
                                                    Book Visit
                                                </Button>
                                            </Group>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </Stack>
                        )}
                    </Grid.Col>
                </Grid>
            </Container>
        </Navigation>
    );
}
