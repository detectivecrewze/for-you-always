import type { Metadata } from "next";
import GiftFinderClient from "./GiftFinderClient";

export const metadata: Metadata = {
    title: "Gift Finder | For you, Always.",
    description: "Temukan kado yang paling cocok berdasarkan momen, penerima, format, dan budgetmu.",
    alternates: { canonical: "/gift-finder" },
};

export default function GiftFinderPage() {
    return <GiftFinderClient />;
}
