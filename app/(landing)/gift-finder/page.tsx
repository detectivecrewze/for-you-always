import type { Metadata } from "next";
import GiftFinderClient from "./GiftFinderClient";

export const metadata: Metadata = {
    title: "Gift Finder | For you, Always.",
    description: "Temukan kado yang paling sesuai berdasarkan penerima, tujuan, pengalaman, dan bahan yang ingin kamu siapkan.",
    alternates: { canonical: "/gift-finder" },
};

export default function GiftFinderPage() {
    return <GiftFinderClient />;
}
