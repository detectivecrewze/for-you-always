import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mixtape Edition - Cassette Playlist | For you, Always.",
  description: "Kembalikan memori lagu-lagu favorit kalian dalam kaset digital interaktif yang bisa diputar kapan saja.",
  openGraph: {
    title: "Mixtape Edition - Cassette Playlist",
    description: "Kembalikan memori lagu-lagu favorit kalian dalam kaset digital interaktif yang bisa diputar kapan saja.",
    images: ["https://cdn.for-you-always.my.id/1781034685666-udzbps.png"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
