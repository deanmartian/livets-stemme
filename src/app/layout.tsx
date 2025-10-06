import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Livets Stemme - Bevar dine livshistorier",
  description: "En trygg og enkel måte å ta opp og bevare livshistoriene dine for familien. Spesiallaget for eldre brukere med AI-assistanse og enkle deling-funksjoner.",
  keywords: "livshistorier, opptak, familie, minner, norsk, eldre, AI-assistanse, stemme",
  openGraph: {
    title: "Livets Stemme - Bevar dine livshistorier",
    description: "En trygg og enkel måte å ta opp og bevare livshistoriene dine for familien.",
    type: "website",
    locale: "nb_NO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
