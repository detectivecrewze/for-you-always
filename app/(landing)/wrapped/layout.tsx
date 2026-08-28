import type { Metadata } from "next";
import "./wrapped.css";

export const metadata: Metadata = {
    alternates: { canonical: "/wrapped" },
};

export default function WrappedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
