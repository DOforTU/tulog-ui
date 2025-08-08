"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

function GlobalRedirectHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams.get("success") === "true") {
            window.location.href = "/";
        }
    }, [searchParams, router]);
    return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider>
                    <AuthProvider>
                        <GlobalRedirectHandler />
                        <Header />
                        {children}
                        <Footer />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
