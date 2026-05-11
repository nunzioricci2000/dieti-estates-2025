"use client";

import {
    Container,
    Grid,
    Card,
    Title,
    Text,
    Button,
    Stack,
    Group,
    Badge,
    SimpleGrid,
    Table,
    Modal,
    TextInput,
    NumberInput,
    Textarea,
    Select,
    FileInput,
    Alert,
    Tabs,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAdvertisementMetrics, useCreateAdvertisement } from "@/api/hooks";
import { useState } from "react";
import {
    IconPlus,
    IconChartBar,
    IconHome,
    IconEye,
    IconCalendar,
    IconAlertCircle,
} from "@tabler/icons-react";
import { Navigation } from "@/components/Navigation/Navigation";

export default function AgentDashboardPage() {
    const { data: metricsData, isLoading } = useAdvertisementMetrics();
    const createAdvertisement = useCreateAdvertisement();
    const [modalOpen, setModalOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);

    const form = useForm({
        initialValues: {
            address: "",
            city: "",
            latitude: "",
            longitude: "",
            description: "",
            dimensions: 0,
            numberOfRooms: 0,
            energyClass: "C",
            additionalServices: [],
            kind: "sale",
            price: 0,
        },
    });

    const handleCreateAdvertisement = async (values: typeof form.values) => {
        try {
            await createAdvertisement.mutateAsync({
                ...values,
                images: images,
            });
            setModalOpen(false);
            form.reset();
            setImages([]);
        } catch (error) {
            console.error("Failed to create advertisement:", error);
        }
    };

    const metrics = {
        totalProperties: metricsData?.advertisements?.length || 0,
        totalViews: metricsData?.totalViews || 0,
        totalVisits: metricsData?.totalVisitsRequested || 0,
    };

    return (
        <Navigation userRole="agent">
            <Container size="lg">
                <Group justify="space-between" mb="xl">
                    <Title>Agent Dashboard</Title>
                    <Button leftSection={<IconPlus size={14} />} onClick={() => setModalOpen(true)}>
                        List New Property
                    </Button>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
                    <Card withBorder p="lg">
                        <Group justify="space-between" mb="sm">
                            <Title order={3}>Properties</Title>
                            <IconHome size={20} />
                        </Group>
                        <Text size="xl" fw={700}>
                            {metrics.totalProperties}
                        </Text>
                        <Text size="sm" c="dimmed">
                            Active listings
                        </Text>
                    </Card>

                    <Card withBorder p="lg">
                        <Group justify="space-between" mb="sm">
                            <Title order={3}>Views</Title>
                            <IconEye size={20} />
                        </Group>
                        <Text size="xl" fw={700}>
                            {metrics.totalViews.toLocaleString()}
                        </Text>
                        <Text size="sm" c="dimmed">
                            Total views
                        </Text>
                    </Card>

                    <Card withBorder p="lg">
                        <Group justify="space-between" mb="sm">
                            <Title order={3}>Visits</Title>
                            <IconCalendar size={20} />
                        </Group>
                        <Text size="xl" fw={700}>
                            {metrics.totalVisits.toLocaleString()}
                        </Text>
                        <Text size="sm" c="dimmed">
                            Requested visits
                        </Text>
                    </Card>
                </SimpleGrid>

                <Tabs defaultValue="properties">
                    <Tabs.List>
                        <Tabs.Tab value="properties">My Properties</Tabs.Tab>
                        <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
                        <Tabs.Tab value="bookings">Bookings</Tabs.Tab>
                        <Tabs.Tab value="offers">Offers</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="properties" pt="md">
                        <Card withBorder>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Address</Table.Th>
                                        <Table.Th>Type</Table.Th>
                                        <Table.Th>Price</Table.Th>
                                        <Table.Th>Views</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {metricsData?.advertisements?.map((property: any) => (
                                        <Table.Tr key={property.id}>
                                            <Table.Td>{property.address}</Table.Td>
                                            <Table.Td>
                                                <Badge>
                                                    {property.kind === "sale" ? "Sale" : "Rent"}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>{property.price.toLocaleString()}€</Table.Td>
                                            <Table.Td>{property.views}</Table.Td>
                                            <Table.Td>
                                                <Badge color={property.taken ? "red" : "green"}>
                                                    {property.taken ? "Taken" : "Active"}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Button size="xs" variant="light">
                                                    Edit
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="analytics" pt="md">
                        <SimpleGrid cols={{ base: 1 }} spacing="md">
                            <Card withBorder p="lg">
                                <Title order={3} mb="md">
                                    Property Performance
                                </Title>
                                <Text size="sm" c="dimmed">
                                    Analytics data will be displayed here
                                </Text>
                            </Card>
                        </SimpleGrid>
                    </Tabs.Panel>

                    <Tabs.Panel value="bookings" pt="md">
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                Upcoming Bookings
                            </Title>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Property</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Time</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td colSpan={5}>No bookings yet</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="offers" pt="md">
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                Received Offers
                            </Title>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Property</Table.Th>
                                        <Table.Th>Amount</Table.Th>
                                        <Table.Th>From</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td colSpan={5}>No offers yet</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Card>
                    </Tabs.Panel>
                </Tabs>

                <Modal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="List New Property"
                    size="lg"
                >
                    <form onSubmit={form.onSubmit(handleCreateAdvertisement)}>
                        <Stack gap="md">
                            <Group grow>
                                <TextInput
                                    label="Address"
                                    placeholder="Street address"
                                    required
                                    {...form.getInputProps("address")}
                                />
                                <TextInput
                                    label="City"
                                    placeholder="City"
                                    required
                                    {...form.getInputProps("city")}
                                />
                            </Group>

                            <Group grow>
                                <TextInput
                                    label="Latitude"
                                    placeholder="Latitude"
                                    required
                                    {...form.getInputProps("latitude")}
                                />
                                <TextInput
                                    label="Longitude"
                                    placeholder="Longitude"
                                    required
                                    {...form.getInputProps("longitude")}
                                />
                            </Group>

                            <Textarea
                                label="Description"
                                placeholder="Property description"
                                required
                                {...form.getInputProps("description")}
                            />

                            <Group grow>
                                <NumberInput
                                    label="Dimensions (m²)"
                                    placeholder="0"
                                    required
                                    {...form.getInputProps("dimensions")}
                                />
                                <NumberInput
                                    label="Number of Rooms"
                                    placeholder="0"
                                    required
                                    {...form.getInputProps("numberOfRooms")}
                                />
                            </Group>

                            <Group grow>
                                <Select
                                    label="Type"
                                    placeholder="Select type"
                                    data={[
                                        { value: "sale", label: "For Sale" },
                                        { value: "rent", label: "For Rent" },
                                    ]}
                                    required
                                    {...form.getInputProps("kind")}
                                />
                                <Select
                                    label="Energy Class"
                                    placeholder="Select energy class"
                                    data={[
                                        { value: "A", label: "Class A" },
                                        { value: "B", label: "Class B" },
                                        { value: "C", label: "Class C" },
                                        { value: "D", label: "Class D" },
                                    ]}
                                    required
                                    {...form.getInputProps("energyClass")}
                                />
                            </Group>

                            <NumberInput
                                label="Price"
                                placeholder="0"
                                required
                                {...form.getInputProps("price")}
                            />

                            <FileInput
                                label="Images"
                                placeholder="Upload property images"
                                multiple
                                accept="image/png,image/jpeg"
                                onChange={(files) => setImages(files)}
                            />

                            <Button type="submit" loading={createAdvertisement.isPending}>
                                List Property
                            </Button>
                        </Stack>
                    </form>
                </Modal>
            </Container>
        </Navigation>
    );
}
