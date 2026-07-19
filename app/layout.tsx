import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colson Knight — Art Direction + Creative Systems",
  description:
    "Visual systems, creative tools, and real-time experiments built to be played, tuned, and directed.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
