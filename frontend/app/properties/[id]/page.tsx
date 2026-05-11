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
    Title,
    SimpleGrid,
    Carousel,
    Modal,
    TextInput,
    NumberInput,
    Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAdvertisementMetrics } from "@/api/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
    IconAlertCircle,
    IconMapPin,
    IconDoorOpen,
    IconRuler,
    IconZap,
    IconPhone,
} from "@tabler/icons-react";
import { Navigation } from "@/components/Navigation/Navigation";

export default function PropertyDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: metricsData } = useAdvertisementMetrics();
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [offerModalOpen, setOfferModalOpen] = useState(false);

    const property = metricsData?.advertisements?.find(
        (p: any) => p.id === parseInt(id)
    );

    const bookingForm = useForm({
        initialValues: {
            date: "",
            time: "",
            phone: "",
        },
    });

    const offerForm = useForm({
        initialValues: {
            price: property?.price || 0,
            message: "",
        },
    });

    const handleBookingSubmit = (values: typeof bookingForm.values) => {
        // Handle booking
        console.log("Booking:", values);
        setBookingModalOpen(false);
        bookingForm.reset();
    };

    const handleOfferSubmit = (values: typeof offerForm.values) => {
        // Handle offer
        console.log("Offer:", values);
        setOfferModalOpen(false);
        offerForm.reset();
    };

    if (!property) {
        return (
            <Navigation userRole="user">
                <Container>
                    <Alert icon={<IconAlertCircle size={16} />} color="red">
                        Property not found
                    </Alert>
                </Container>
            </Navigation>
        );
    }

    return (
        <Navigation userRole="user">
            <Container size="lg">
                <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card withBorder>
                            {property.images && property.images.length > 0 ? (
                                <Carousel withIndicators loop>
                                    {property.images.map((image: string, idx: number) => (
                                        <Carousel.Slide key={idx}>
                                            <Image src={image} alt={`${property.address} ${idx}`} height={400} />
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            ) : (
                                <div style={{ height: 400, backgroundColor: "#f0f0f0" }} />
                            )}
                        </Card>

                        <Card withBorder mt="lg" p="lg">
                            <Title order={2} mb="md">
                                {property.address}
                            </Title>

                            <Group gap="md" mb="md">
                                <Badge size="lg">{property.kind === "sale" ? "For Sale" : "For Rent"}</Badge>
                                <Badge size="lg" color="blue">
                                    {property.price.toLocaleString()}€
                                </Badge>
                            </Group>

                            <Text c="dimmed" mb="lg">
                                {property.city}
                            </Text>

                            <Title order={3} mb="md">
                                Property Details
                            </Title>

                            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="lg">
                                <div>
                                    <Group gap="xs">
                                        <IconDoorOpen size={18} />
                                        <div>
                                            <Text size="xs" c="dimmed">
                                                Rooms
                                            </Text>
                                            <Text fw={500}>{property.numberOfRooms}</Text>
                                        </div>
                                    </Group>
                                </div>
                                <div>
                                    <Group gap="xs">
                                        <IconRuler size={18} />
                                        <div>
                                            <Text size="xs" c="dimmed">
                                                Size
                                            </Text>
                                            <Text fw={500}>{property.dimensions}m²</Text>
                                        </div>
                                    </Group>
                                </div>
                                <div>
                                    <Group gap="xs">
                                        <IconZap size={18} />
                                        <div>
                                            <Text size="xs" c="dimmed">
                                                Energy Class
                                            </Text>
                                            <Text fw={500}>{property.energyClass}</Text>
                                        </div>
                                    </Group>
                                </div>
                                <div>
                                    <Group gap="xs">
                                        <IconMapPin size={18} />
                                        <div>
                                            <Text size="xs" c="dimmed">
                                                Coordinates
                                            </Text>
                                            <Text fw={500} size="xs">
                                                {property.coordinates.latitude.toFixed(2)}, {property.coordinates.longitude.toFixed(2)}
                                            </Text>
                                        </div>
                                    </Group>
                                </div>
                            </SimpleGrid>

                            <Title order={3} mb="md">
                                Description
                            </Title>
                            <Text mb="lg">{property.description}</Text>

                            {property.additionalServices && property.additionalServices.length > 0 && (
                                <>
                                    <Title order={3} mb="md">
                                        Additional Services
                                    </Title>
                                    <Group gap="xs" mb="lg">
                                        {property.additionalServices.map((service: string) => (
                                            <Badge key={service} variant="light">
                                                {service}
                                            </Badge>
                                        ))}
                                    </Group>
                                </>
                            )}

                            {property.nearbyPOIs && property.nearbyPOIs.length > 0 && (
                                <>
                                    <Title order={3} mb="md">
                                        Nearby Points of Interest
                                    </Title>
                                    <Stack gap="xs">
                                        {property.nearbyPOIs.map((poi: string) => (
                                            <Text key={poi} size="sm">
                                                • {poi}
                                            </Text>
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Card>

                        <Card withBorder mt="lg" p="lg">
                            <Title order={3} mb="md">
                                Metrics
                            </Title>
                            <SimpleGrid cols={{ base: 3 }} spacing="md">
                                <div>
                                    <Text size="xs" c="dimmed">
                                        Views
                                    </Text>
                                    <Text fw={500}>{property.views}</Text>
                                </div>
                                <div>
                                    <Text size="xs" c="dimmed">
                                        Visits Requested
                                    </Text>
                                    <Text fw={500}>{property.visits}</Text>
                                </div>
                                <div>
                                    <Text size="xs" c="dimmed">
                                        Offers Received
                                    </Text>
                                    <Text fw={500}>{property.offers}</Text>
                                </div>
                            </SimpleGrid>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card withBorder p="lg" sticky>
                            <Title order={3} mb="md">
                                Contact
                            </Title>
                            <Stack gap="md">
                                <Button fullWidth onClick={() => setBookingModalOpen(true)}>
                                    Book a Visit
                                </Button>
                                <Button fullWidth variant="light" onClick={() => setOfferModalOpen(true)}>
                                    Make an Offer
                                </Button>
                                <Button fullWidth variant="light">
                                    Contact Agent
                                </Button>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>

                <Modal
                    opened={bookingModalOpen}
                    onClose={() => setBookingModalOpen(false)}
                    title="Book a Visit"
                >
                    <form onSubmit={bookingForm.onSubmit(handleBookingSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label="Date"
                                type="date"
                                {...bookingForm.getInputProps("date")}
                            />
                            <TextInput
                                label="Time"
                                type="time"
                                {...bookingForm.getInputProps("time")}
                            />
                            <TextInput
                                label="Phone"
                                placeholder="Your phone number"
                                {...bookingForm.getInputProps("phone")}
                            />
                            <Button fullWidth type="submit">
                                Book Visit
                            </Button>
                        </Stack>
                    </form>
                </Modal>

                <Modal
                    opened={offerModalOpen}
                    onClose={() => setOfferModalOpen(false)}
                    title="Make an Offer"
                >
                    <form onSubmit={offerForm.onSubmit(handleOfferSubmit)}>
                        <Stack gap="md">
                            <NumberInput
                                label="Offer Price"
                                {...offerForm.getInputProps("price")}
                            />
                            <TextInput
                                label="Message"
                                placeholder="Optional message to the agent"
                                {...offerForm.getInputProps("message")}
                            />
                            <Button fullWidth type="submit">
                                Submit Offer
                            </Button>
                        </Stack>
                    </form>
                </Modal>
            </Container>
        </Navigation>
    );
}
