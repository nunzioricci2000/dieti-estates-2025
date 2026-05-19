import "@mantine/core/styles.css";
import {
    ColorSchemeScript,
    mantineHtmlProps,
    MantineProvider,
} from "@mantine/core";
import React from "react";
import { theme } from "../theme";

export const metadata = {
    title: "Dieti Estates 2025",
    description: "Portale immobiliare con ricerca, dashboard e gestione utenti",
};

export default function RootLayout({ children }: { children: any }) {
    return (
        <html lang="it" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body>
                <MantineProvider theme={theme}>{children}</MantineProvider>
            </body>
        </html>
    );
}
