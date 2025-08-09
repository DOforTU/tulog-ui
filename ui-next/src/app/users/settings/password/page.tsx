"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/lib/api/users";
import styles from "./password.module.css";

export default function PasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
        setSuccess(false);
    };

    const validateForm = () => {
        if (!formData.oldPassword) {
            setError("Current password is required");
            return false;
        }
        if (!formData.newPassword) {
            setError("New password is required");
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            return false;
        }
        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters long");
            return false;
        }
        if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
            setError("New password must contain at least 1 uppercase letter");
            return false;
        }
        if (!/(?=.*[a-z])/.test(formData.newPassword)) {
            setError("New password must contain at least 1 lowercase letter");
            return false;
        }
        if (!/(?=.*\d)/.test(formData.newPassword)) {
            setError("New password must contain at least 1 number");
            return false;
        }
        if (!/(?=.*[!@#$%^&*()\-_=+{}[\]|\\:;"'<>,.?/`~])/.test(formData.newPassword)) {
            setError("New password must contain at least 1 special character");
            return false;
        }
        if (/\s/.test(formData.newPassword)) {
            setError("New password must not contain spaces");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            await updatePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });

            setSuccess(true);
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            // Redirect after successful update
            setTimeout(() => {
                router.push("/users/settings");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.passwordContainer}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push("/users/settings")}>
                    ← Back
                </button>
                <h1 className={styles.title}>Change Password</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="oldPassword" className={styles.label}>
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="newPassword" className={styles.label}>
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                    <div className={styles.passwordRequirements}>
                        <p>Password must contain:</p>
                        <ul>
                            <li>At least 8 characters</li>
                            <li>At least 1 uppercase letter</li>
                            <li>At least 1 lowercase letter</li>
                            <li>At least 1 number</li>
                            <li>At least 1 special character</li>
                            <li>No spaces</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {success && <div className={styles.success}>Password updated successfully! Redirecting...</div>}

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}
