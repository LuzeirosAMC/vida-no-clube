import type { Metadata } from "next";
import { ScrollEffects } from "../components/scroll-effects";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clube de Desbravadores Luzeiros",
    template: "%s · Luzeiros",
  },
  description:
    "Desde 1984, o Clube de Desbravadores Luzeiros reúne gerações em Contagem para aprender, servir e construir memórias.",
  keywords: [
    "Desbravadores",
    "Luzeiros",
    "Contagem",
    "Bandeirantes",
    "Clube de Desbravadores",
  ],
  openGraph: {
    title: "Clube de Desbravadores Luzeiros",
    description: "Gerações que aprendem, servem e iluminam desde 1984.",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <ScrollEffects />
      </body>
    </html>
  );
}
