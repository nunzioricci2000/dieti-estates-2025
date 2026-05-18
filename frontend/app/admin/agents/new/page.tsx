"use client";

import { useState } from "react";
import { Alert } from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { api } from "../../../../api";
import { IdentityForm } from "../../../../components/forms/identity-form";
import { AppShellFrame } from "../../../../components/layout/app-shell-frame";

export default function CreateAgentPage() {
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

        await api.createAgent({ username, email, password });
        setSuccessMessage(`Agente ${username} creato con successo`);
    };

    return (
        <AppShellFrame
            title="Creazione agente"
            description="Form creazione utente agente."
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
                    agente.
                </Alert>
            )}
            <IdentityForm
                title="Nuovo agente"
                description="Inserisci le credenziali dell’agente da registrare."
                submitLabel="Crea agente"
                showUsername
                onSubmit={handleSubmit}
            />
        </AppShellFrame>
    );
}
