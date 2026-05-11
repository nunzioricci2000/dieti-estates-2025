"use client";

import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Card,
    SimpleGrid,
    Image,
    Badge,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowRight, IconHome, IconUsers, IconChartLine } from "@tabler/icons-react";
import { Navigation } from "@/components/Navigation/Navigation";

export default function HomePage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        setIsAuthenticated(!!token);
    }, []);

    const features = [
        {
            title: "Browse Properties",
            description: "Explore thousands of residential and commercial properties",
            icon: IconHome,
        },
        {
            title: "Easy Booking",
            description: "Schedule visits and make offers in just a few clicks",
            icon: IconUsers,
        },
        {
            title: "Smart Analytics",
            description: "Track property performance and market trends",
            icon: IconChartLine,
        },
    ];

    if (!isAuthenticated) {
        return (
            <Container size="lg" py={80}>
                <Stack gap={60} align="center">
                    <Stack gap={20} align="center">
                        <Title order={1}>Welcome to DietiEstates25</Title>
                        <Text size="lg" c="dimmed">
                            Your comprehensive platform for real estate management
                        </Text>
                    </Stack>

                    <Group>
                        <Button
                            size="lg"
                            rightSection={<IconArrowRight size={14} />}
                            onClick={() => router.push("/login")}
                        >
                            Get Started
                        </Button>
                        <Button size="lg" variant="light">
                            Learn More
                        </Button>
                    </Group>

                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt={50}>
                        {features.map((feature) => (
                            <Card key={feature.title} withBorder p="lg">
                                <feature.icon size={32} style={{ marginBottom: 8 }} />
                                <Title order={3}>{feature.title}</Title>
                                <Text size="sm" c="dimmed" mt="sm">
                                    {feature.description}
                                </Text>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Stack>
            </Container>
        );
    }

    return (
        <Navigation userRole="user">
            <Container size="lg">
                <Title mb="xl">Dashboard</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Card withBorder>
                        <Title order={3}>Quick Actions</Title>
                        <Stack gap="sm" mt="md">
                            <Button fullWidth onClick={() => router.push("/properties")}>
                                Browse Properties
                            </Button>
                            <Button fullWidth variant="light">
                                View My Bookings
                            </Button>
                            <Button fullWidth variant="light">
                                My Offers
                            </Button>
                        </Stack>
                    </Card>
                    <Card withBorder>
                        <Title order={3}>Recent Activity</Title>
                        <Text c="dimmed" mt="md">
                            No recent activity
                        </Text>
                    </Card>
                </SimpleGrid>
            </Container>
        </Navigation>
    );
}

