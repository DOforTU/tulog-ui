"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/users/settings/me");
    }, [router]);

    return null;
}
