import type { Metadata } from "next";
import "./arcade.css";

export const metadata: Metadata = {
    alternates: { canonical: "/arcade" },
};

export default function ArcadeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
