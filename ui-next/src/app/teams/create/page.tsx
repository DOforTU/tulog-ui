"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./createTeam.module.css";
import { createTeam } from "@/lib/api/teams";
import { TeamVisibility } from "@/lib/types/team.interface";

export default function CreateTeamPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [maxMember, setMaxMember] = useState(10);
    const [visibility, setVisibility] = useState("ONLY_INVITE");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name,
            introduction,
            maxMember,
            visibility: visibility as TeamVisibility,
        };

        try {
            const res = await createTeam(payload);
            router.push(`/teams/@${res.data.name}`);
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            alert(Array.isArray(msg) ? msg.join("\n") : msg || "Failed to create team");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create Team</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Team Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Introduction</label>
                    <textarea
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        className={styles.textarea}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Max Members <span className={styles.hint}>(1~10)</span>
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={maxMember}
                        onChange={(e) => setMaxMember(Number(e.target.value))}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Status</label>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className={styles.select}
                        defaultValue={"ONLY_INVITE"}
                    >
                        <option value="ONLY_INVITE">Invite Only</option>
                        <option value="INVITE_AND_REQUEST">Invite & Request</option>
                    </select>
                </div>
                <button type="submit" className={styles.button}>
                    Create
                </button>
            </form>
        </div>
    );
}
