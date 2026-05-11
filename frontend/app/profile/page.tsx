"use client";

import {
    Container,
    Card,
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Group,
    Title,
    Avatar,
    Grid,
    Tabs,
    Table,
    Badge,
    Text,
    Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useChangePassword } from "@/api/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { Navigation } from "@/components/Navigation/Navigation";

export default function ProfilePage() {
    const router = useRouter();
    const changePassword = useChangePassword();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) {
            router.push("/login");
        } else {
            setEmail(userEmail);
        }
    }, [router]);

    const form = useForm({
        initialValues: {
            firstName: "",
            lastName: "",
            email: email,
            phone: "",
            bio: "",
        },
    });

    const passwordForm = useForm({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validate: {
            newPassword: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
            confirmPassword: (value) =>
                value !== passwordForm.values.newPassword
                    ? "Passwords do not match"
                    : null,
        },
    });

    const handleChangePassword = async (values: typeof passwordForm.values) => {
        try {
            setError(null);
            await changePassword.mutateAsync(values.newPassword);
            passwordForm.reset();
            // Show success message
        } catch (err: any) {
            setError(err.message || "Failed to change password");
        }
    };

    return (
        <Navigation userRole="user">
            <Container size="lg">
                <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card withBorder p="lg">
                            <Group justify="center" mb="lg">
                                <Avatar name={email} size="xl" radius="xl" />
                            </Group>
                            <Text ta="center" fw={500} mb="md">
                                {email}
                            </Text>
                            <Button fullWidth>Upload Photo</Button>
                        </Card>

                        <Card withBorder p="lg" mt="lg">
                            <Title order={3} mb="md">
                                Account Type
                            </Title>
                            <Badge fullWidth mb="md">
                                Regular User
                            </Badge>
                            <Text size="sm" c="dimmed">
                                Member since 2024
                            </Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Tabs defaultValue="profile">
                            <Tabs.List>
                                <Tabs.Tab value="profile">Profile</Tabs.Tab>
                                <Tabs.Tab value="security">Security</Tabs.Tab>
                                <Tabs.Tab value="activity">Activity</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="profile" pt="md">
                                <Card withBorder p="lg">
                                    <Title order={3} mb="md">
                                        Personal Information
                                    </Title>
                                    <form onSubmit={form.onSubmit((values) => console.log(values))}>
                                        <Stack gap="md">
                                            <Group grow>
                                                <TextInput
                                                    label="First Name"
                                                    placeholder="Your first name"
                                                    {...form.getInputProps("firstName")}
                                                />
                                                <TextInput
                                                    label="Last Name"
                                                    placeholder="Your last name"
                                                    {...form.getInputProps("lastName")}
                                                />
                                            </Group>
                                            <TextInput
                                                label="Email"
                                                placeholder="your@email.com"
                                                disabled
                                                {...form.getInputProps("email")}
                                            />
                                            <TextInput
                                                label="Phone"
                                                placeholder="Your phone number"
                                                {...form.getInputProps("phone")}
                                            />
                                            <TextInput
                                                label="Bio"
                                                placeholder="Tell us about yourself"
                                                {...form.getInputProps("bio")}
                                            />
                                            <Button type="submit">Save Changes</Button>
                                        </Stack>
                                    </form>
                                </Card>
                            </Tabs.Panel>

                            <Tabs.Panel value="security" pt="md">
                                <Card withBorder p="lg">
                                    <Title order={3} mb="md">
                                        Change Password
                                    </Title>
                                    {error && (
                                        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                                            {error}
                                        </Alert>
                                    )}
                                    <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
                                        <Stack gap="md">
                                            <PasswordInput
                                                label="Current Password"
                                                placeholder="Enter your current password"
                                                {...passwordForm.getInputProps("currentPassword")}
                                            />
                                            <PasswordInput
                                                label="New Password"
                                                placeholder="Enter your new password"
                                                {...passwordForm.getInputProps("newPassword")}
                                            />
                                            <PasswordInput
                                                label="Confirm Password"
                                                placeholder="Confirm your new password"
                                                {...passwordForm.getInputProps("confirmPassword")}
                                            />
                                            <Button type="submit" loading={changePassword.isPending}>
                                                Change Password
                                            </Button>
                                        </Stack>
                                    </form>
                                </Card>
                            </Tabs.Panel>

                            <Tabs.Panel value="activity" pt="md">
                                <Card withBorder p="lg">
                                    <Title order={3} mb="md">
                                        Recent Activity
                                    </Title>
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Date</Table.Th>
                                                <Table.Th>Activity</Table.Th>
                                                <Table.Th>Details</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            <Table.Tr>
                                                <Table.Td>No activity yet</Table.Td>
                                                <Table.Td>-</Table.Td>
                                                <Table.Td>-</Table.Td>
                                            </Table.Tr>
                                        </Table.Tbody>
                                    </Table>
                                </Card>
                            </Tabs.Panel>
                        </Tabs>
                    </Grid.Col>
                </Grid>
            </Container>
        </Navigation>
    );
}
