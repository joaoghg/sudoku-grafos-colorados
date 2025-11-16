import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Sudoku & Coloração de Grafos | Projeto Acadêmico",
  description:
    "Aplicação interativa demonstrando como resolver Sudoku usando Teoria dos Grafos e algoritmos de coloração. Projeto acadêmico por João Guilherme, Igor, Thales e Matheus.",
  keywords: [
    "Sudoku",
    "Teoria dos Grafos",
    "Coloração de Grafos",
    "Algoritmos",
    "Backtracking",
  ],
  authors: [
    { name: "João Guilherme Herreira Garnica" },
    { name: "Igor Ribeiro Scarlassara" },
    { name: "Thales Zaitum" },
    { name: "Matheus Biagio" },
  ],
  openGraph: {
    title: "Sudoku & Coloração de Grafos",
    description: "Resolução interativa de Sudoku usando Teoria dos Grafos",
    url: "/",
    siteName: "Sudoku Coloração Grafos",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoku & Coloração de Grafos",
    description: "Resolução interativa de Sudoku usando Teoria dos Grafos",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
