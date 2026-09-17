import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyayaAI — Federated Agentic Legal Framework | Constitution of India",
  description:
    "Production-grade 13-stage AI legal assistant grounded in the Constitution of India. Strict IRAC reasoning, citation trails, and privacy-preserving federated architecture.",
  keywords: [
    "NyayaAI",
    "Indian Law AI",
    "Constitution of India",
    "Multi-Agent AI",
    "IRAC Legal Reasoning",
    "Legal Tech India",
    "Federated AI",
    "Trust Scoring",
  ],
  authors: [{ name: "NyayaAI Research Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="ambient-glow" />
        {children}
      </body>
    </html>
  );
}
