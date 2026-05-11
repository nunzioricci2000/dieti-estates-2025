"use client";

import {
    Container,
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
    PasswordInput,
    Tabs,
    Alert,
    Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateAdmin, useCreateAgent } from "@/api/hooks";
import { useState } from "react";
import { IconPlus, IconUsers, IconShield, IconAlertCircle } from "@tabler/icons-react";
import { Navigation } from "@/components/Navigation/Navigation";

export default function AdminPage() {
    const createAdmin = useCreateAdmin();
    const createAgent = useCreateAgent();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"admin" | "agent">("admin");
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
            password: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
            confirmPassword: (value) =>
                value !== form.values.password
                    ? "Passwords do not match"
                    : null,
        },
    });

    const handleCreateUser = async (values: typeof form.values) => {
        try {
            setError(null);
            const userData = {
                username: values.username,
                email: values.email,
                password: values.password,
            };

            if (modalType === "admin") {
                await createAdmin.mutateAsync(userData);
            } else {
                await createAgent.mutateAsync(userData);
            }

            setModalOpen(false);
            form.reset();
        } catch (err: any) {
            setError(err.message || "Failed to create user");
        }
    };

    const stats = [
        { label: "Total Admins", value: "2", icon: IconShield },
        { label: "Total Agents", value: "15", icon: IconUsers },
        { label: "Active Users", value: "342", icon: IconUsers },
    ];

    return (
        <Navigation userRole="admin">
            <Container size="lg">
                <Group justify="space-between" mb="xl">
                    <Title>Administration Panel</Title>
                    <Group>
                        <Button
                            leftSection={<IconPlus size={14} />}
                            onClick={() => {
                                setModalType("admin");
                                setModalOpen(true);
                            }}
                        >
                            Add Admin
                        </Button>
                        <Button
                            leftSection={<IconPlus size={14} />}
                            variant="light"
                            onClick={() => {
                                setModalType("agent");
                                setModalOpen(true);
                            }}
                        >
                            Add Agent
                        </Button>
                    </Group>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
                    {stats.map((stat) => (
                        <Card key={stat.label} withBorder p="lg">
                            <Group justify="space-between" mb="sm">
                                <Title order={3}>{stat.label}</Title>
                                <stat.icon size={20} />
                            </Group>
                            <Text size="xl" fw={700}>
                                {stat.value}
                            </Text>
                        </Card>
                    ))}
                </SimpleGrid>

                <Tabs defaultValue="overview">
                    <Tabs.List>
                        <Tabs.Tab value="overview">Overview</Tabs.Tab>
                        <Tabs.Tab value="admins">Admins</Tabs.Tab>
                        <Tabs.Tab value="agents">Agents</Tabs.Tab>
                        <Tabs.Tab value="users">Users</Tabs.Tab>
                        <Tabs.Tab value="system">System</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="overview" pt="md">
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                System Overview
                            </Title>
                            <Stack gap="md">
                                <Group justify="space-between">
                                    <Text>API Status</Text>
                                    <Badge color="green">Online</Badge>
                                </Group>
                                <Group justify="space-between">
                                    <Text>Database Status</Text>
                                    <Badge color="green">Connected</Badge>
                                </Group>
                                <Group justify="space-between">
                                    <Text>Last Backup</Text>
                                    <Text>Today at 02:00 AM</Text>
                                </Group>
                            </Stack>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="admins" pt="md">
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                Administrators
                            </Title>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Username</Table.Th>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td>System Admin</Table.Td>
                                        <Table.Td>admin@dietiestates.com</Table.Td>
                                        <Table.Td>
                                            <Badge color="green">Active</Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Button size="xs" variant="light">
                                                Edit
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="agents" pt="md">
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                Agents
                            </Title>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Username</Table.Th>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>Properties</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td colSpan={5}>No agents registered yet</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="users" pt="md">
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                Users
                            </Title>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>Joined</Table.Th>
                                        <Table.Th>Bookings</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td colSpan={4}>No users registered yet</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="system" pt="md">
                        <Card withBorder p="lg">
                            <Title order={3} mb="md">
                                System Settings
                            </Title>
                            <Stack gap="md">
                                <Group justify="space-between">
                                    <Text>Enable User Registrations</Text>
                                    <Badge>Enabled</Badge>
                                </Group>
                                <Group justify="space-between">
                                    <Text>Maintenance Mode</Text>
                                    <Badge color="gray">Off</Badge>
                                </Group>
                                <Button>Configure Settings</Button>
                            </Stack>
                        </Card>
                    </Tabs.Panel>
                </Tabs>

                <Modal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={`Add New ${modalType === "admin" ? "Admin" : "Agent"}`}
                >
                    {error && (
                        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={form.onSubmit(handleCreateUser)}>
                        <Stack gap="md">
                            <TextInput
                                label="Username"
                                placeholder="Username"
                                required
                                {...form.getInputProps("username")}
                            />
                            <TextInput
                                label="Email"
                                placeholder="email@example.com"
                                required
                                {...form.getInputProps("email")}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Password"
                                required
                                {...form.getInputProps("password")}
                            />
                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm password"
                                required
                                {...form.getInputProps("confirmPassword")}
                            />
                            <Button
                                type="submit"
                                loading={createAdmin.isPending || createAgent.isPending}
                            >
                                Create {modalType === "admin" ? "Admin" : "Agent"}
                            </Button>
                        </Stack>
                    </form>
                </Modal>
            </Container>
        </Navigation>
    );
}
