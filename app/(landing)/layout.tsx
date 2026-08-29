import React from "react";
import "./landing.css";
import LandingClientShell from "../components/LandingClientShell";

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LandingClientShell>{children}</LandingClientShell>
    );
}
