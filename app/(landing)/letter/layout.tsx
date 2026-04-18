import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Letter Edition — For you, Always.",
    description: "Sampaikan pesan bermakna melalui surat digital bernuansa sinematik. Hadir dengan amplop interaktif, efek typewriter klasik, dan kustomisasi tema eksklusif.",
    openGraph: {
        title: "Letter Edition — For you, Always.",
        description: "Sampaikan pesan bermakna melalui surat digital bernuansa sinematik. Hadir dengan amplop interaktif dan efek typewriter klasik.",
        url: "https://for-you-always.my.id/letter",
        images: [
            {
                url: "/assets/letter-og.png",
                width: 1200,
                height: 630,
                alt: "Letter Edition Preview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Letter Edition — For you, Always.",
        description: "Sampaikan pesan bermakna melalui surat digital bernuansa sinematik.",
        images: ["/assets/letter-og.png"],
    },
};

export default function LetterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
