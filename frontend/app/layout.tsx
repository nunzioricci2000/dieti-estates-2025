import "@mantine/core/styles.css";
import {
    ColorSchemeScript,
    mantineHtmlProps,
    MantineProvider,
} from "@mantine/core";
import React from "react";
import { theme } from "../theme";
import { Providers } from "./providers";

export const metadata = {
    title: "DietiEstates25 - Real Estate Platform",
    description: "Manage your real estate properties efficiently",
};

export default function RootLayout({ children }: { children: any }) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <Providers>{children}</Providers>
                </MantineProvider>
            </body>
        </html>
    );
}
