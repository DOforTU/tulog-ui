export interface User {
    id: number;
    email: string;
    name: string;
    nickname: string;
    profilePicture: string;
    role: "user" | "admin";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    logout: () => Promise<void>;
    loginWithGoogle: () => void;
    loginWithLocal: (email: string, password: string) => Promise<boolean>;
}

export interface FollowUser {
    id: number;
    profilePicture: string;
    nickname: string;
}
