"use client";

import { useState } from "react";
import { Alert, Text } from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { api } from "../../../../api";
import { IdentityForm } from "../../../../components/forms/identity-form";
import { AppShellFrame } from "../../../../components/layout/app-shell-frame";

export default function CreateAdminPage() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async ({
        username,
        email,
        password,
    }: {
        username?: string;
        email: string;
        password: string;
    }) => {
        if (!username) {
            throw new Error("Username mancante");
        }

        await api.createAdmin({ username, email, password });
        setSuccessMessage(`Admin ${username} creato con successo`);
    };

    return (
        <AppShellFrame
            title="Creazione admin"
            description="Form creazione utente amministratore."
        >
            {successMessage ? (
                <Alert
                    color="green"
                    title="Completato"
                    icon={<IconCheck size={16} />}
                >
                    {successMessage}
                </Alert>
            ) : (
                <Alert
                    color="blue"
                    title="Informazione"
                    icon={<IconInfoCircle size={16} />}
                >
                    Compila username, email e password per creare un nuovo
                    admin.
                </Alert>
            )}
            <IdentityForm
                title="Nuovo amministratore"
                description="Inserisci le credenziali dell’admin da registrare."
                submitLabel="Crea admin"
                showUsername
                onSubmit={handleSubmit}
            />
        </AppShellFrame>
    );
}
