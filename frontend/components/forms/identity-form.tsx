"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
    Alert,
    Button,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export interface IdentityFormValues {
    username?: string;
    email: string;
    password: string;
}

interface IdentityFormProps {
    title: string;
    description: string;
    submitLabel: string;
    showUsername?: boolean;
    onSubmit(values: IdentityFormValues): Promise<void> | void;
}

export function IdentityForm({
    title,
    description,
    submitLabel,
    showUsername = false,
    onSubmit,
}: IdentityFormProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        try {
            await onSubmit({
                username: showUsername ? username.trim() : undefined,
                email: email.trim(),
                password,
            });
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Operazione non riuscita",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper shadow="xl" radius="xl" p="xl" withBorder>
            <Stack gap="lg">
                <Stack gap={4}>
                    <Title order={2}>{title}</Title>
                    <Text c="dimmed">{description}</Text>
                </Stack>

                {errorMessage ? (
                    <Alert
                        color="red"
                        title="Attenzione"
                        icon={<IconInfoCircle size={16} />}
                    >
                        {errorMessage}
                    </Alert>
                ) : null}

                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        {showUsername ? (
                            <TextInput
                                label="Username"
                                placeholder="mario.rossi"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.currentTarget.value)
                                }
                                required
                            />
                        ) : null}
                        <TextInput
                            label="Email"
                            placeholder="utente@dominio.it"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.currentTarget.value)
                            }
                            required
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.currentTarget.value)
                            }
                            required
                        />
                        <Button type="submit" loading={loading} size="md">
                            {submitLabel}
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Paper>
    );
}
