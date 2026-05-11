"use client";

import {
    Container,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Title,
    Text,
    Stack,
    Alert,
    Tabs,
    Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignup } from "@/api/hooks";
import type { SignupRequestDTO } from "@/api/apiSchemas";
import { IconAlertCircle } from "@tabler/icons-react";

export default function LoginPage() {
    const router = useRouter();
    const signup = useSignup();
    const [activeTab, setActiveTab] = useState<string | null>("login");
    const [loginError, setLoginError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
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
                activeTab === "signup" && value !== form.values.password
                    ? "Passwords do not match"
                    : null,
        },
    });

    const handleLogin = async (values: typeof form.values) => {
        try {
            setLoginError(null);
            const response = await signup.mutateAsync({
                email: values.email,
                password: values.password,
            });

            // Store token in localStorage
            if (response.token) {
                localStorage.setItem("auth_token", response.token);
                localStorage.setItem("user_email", values.email);

                // Redirect to home or dashboard based on response
                router.push("/properties");
            }
        } catch (error: any) {
            setLoginError(error.message || "Login failed. Please try again.");
        }
    };

    const handleSignup = async (values: typeof form.values) => {
        try {
            setLoginError(null);
            const response = await signup.mutateAsync({
                email: values.email,
                password: values.password,
            });

            if (response.token) {
                localStorage.setItem("auth_token", response.token);
                localStorage.setItem("user_email", values.email);
                router.push("/properties");
            }
        } catch (error: any) {
            setLoginError(error.message || "Signup failed. Please try again.");
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" mb="xl">
                DietiEstates25
            </Title>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {loginError && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                        {loginError}
                    </Alert>
                )}

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List grow>
                        <Tabs.Tab value="login">Login</Tabs.Tab>
                        <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="login" pt="md">
                        <form onSubmit={form.onSubmit(handleLogin)}>
                            <Stack gap="md">
                                <TextInput
                                    label="Email"
                                    placeholder="you@example.com"
                                    {...form.getInputProps("email")}
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    {...form.getInputProps("password")}
                                />
                                <Button
                                    fullWidth
                                    type="submit"
                                    loading={signup.isPending}
                                >
                                    Sign In
                                </Button>
                            </Stack>
                        </form>
                    </Tabs.Panel>

                    <Tabs.Panel value="signup" pt="md">
                        <form onSubmit={form.onSubmit(handleSignup)}>
                            <Stack gap="md">
                                <TextInput
                                    label="Email"
                                    placeholder="you@example.com"
                                    {...form.getInputProps("email")}
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    {...form.getInputProps("password")}
                                />
                                <PasswordInput
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    {...form.getInputProps("confirmPassword")}
                                />
                                <Button
                                    fullWidth
                                    type="submit"
                                    loading={signup.isPending}
                                >
                                    Create Account
                                </Button>
                            </Stack>
                        </form>
                    </Tabs.Panel>
                </Tabs>

                <Text ta="center" mt="md" size="sm">
                    By signing up or logging in, you agree to our Terms of Service
                </Text>
            </Paper>
        </Container>
    );
}
