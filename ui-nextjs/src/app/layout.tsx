import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SearchProvider } from "@/contexts/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TULOG - 개발자 블로그",
    description: "개발 일상과 기술을 공유하는 블로그입니다",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AuthProvider>
                    <SearchProvider>{children}</SearchProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
