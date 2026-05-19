"use client";

import { useState } from "react";
import { Alert } from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { api } from "../../../api";
import { PasswordChangeForm } from "../../../components/forms/password-change-form";
import { AppShellFrame } from "../../../components/layout/app-shell-frame";

export default function AdminPasswordPage() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (password: string) => {
        await api.changeAdminPassword({ password });
        setSuccessMessage("Password aggiornata con successo");
    };

    return (
        <AppShellFrame
            title="Cambio password"
            description="Form di cambio password per l’admin autenticato."
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
                    Inserisci una nuova password e confermala nel form.
                </Alert>
            )}
            <PasswordChangeForm
                title="Aggiorna password"
                description="Imposta una nuova password per il tuo profilo admin."
                submitLabel="Salva password"
                onSubmit={handleSubmit}
            />
        </AppShellFrame>
    );
}
