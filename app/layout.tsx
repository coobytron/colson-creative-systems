import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colson Knight — Creative Systems",
  description:
    "Creative coding, AI tooling, and generative interfaces built for real-time creative control.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
