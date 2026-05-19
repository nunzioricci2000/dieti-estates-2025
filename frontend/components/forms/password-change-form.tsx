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
    Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

interface PasswordChangeFormProps {
    title: string;
    description: string;
    submitLabel: string;
    onSubmit(password: string): Promise<void> | void;
}

export function PasswordChangeForm({
    title,
    description,
    submitLabel,
    onSubmit,
}: PasswordChangeFormProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Le password non coincidono");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            await onSubmit(password);
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
                        <PasswordInput
                            label="Nuova password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.currentTarget.value)
                            }
                            required
                        />
                        <PasswordInput
                            label="Conferma password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.currentTarget.value)
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
