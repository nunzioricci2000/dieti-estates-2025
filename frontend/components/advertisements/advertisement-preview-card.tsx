"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Button, Card, Group, Image, Stack, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import type { AdvertisementDTO } from "../../api";

interface AdvertisementPreviewCardProps {
    advertisement: AdvertisementDTO;
    href: string;
    actionLabel?: string;
    footer?: ReactNode;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(price);
}

export function AdvertisementPreviewCard({
    advertisement,
    href,
    actionLabel = "Vai a inserzione",
    footer,
}: AdvertisementPreviewCardProps) {
    const heroImage = advertisement.images[0];

    return (
        <Card shadow="sm" radius="xl" withBorder padding="lg">
            <Stack gap="md">
                <Card radius="lg" p={0} withBorder>
                    {heroImage ? (
                        <Image
                            src={heroImage}
                            alt={advertisement.address}
                            h={200}
                        />
                    ) : (
                        <div
                            style={{
                                height: 200,
                                background:
                                    "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 118, 110, 0.7))",
                            }}
                        />
                    )}
                </Card>

                <Group justify="space-between" align="start">
                    <Stack gap={4}>
                        <Text fw={700}>{advertisement.address}</Text>
                        <Text c="dimmed" size="sm">
                            {advertisement.city}
                        </Text>
                    </Stack>
                    <Badge variant="light" color="teal">
                        {advertisement.kind}
                    </Badge>
                </Group>

                <Text lineClamp={3} c="dimmed">
                    {advertisement.description}
                </Text>

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
                </Group>

                <Group justify="space-between" align="center">
                    <Text fw={700} size="lg">
                        {formatPrice(advertisement.price)}
                    </Text>
                    <Button
                        component={Link}
                        href={href}
                        rightSection={<IconArrowRight size={16} />}
                    >
                        {actionLabel}
                    </Button>
                </Group>

                {footer ? <div>{footer}</div> : null}
            </Stack>
        </Card>
    );
}
