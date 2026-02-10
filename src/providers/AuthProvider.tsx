"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define User Type
type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
} | null;

interface AuthContextType {
    user: User;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Initialize with a mock user for now (simulating a logged-in state)
    // In a real app, this would check localStorage or session on mount
    const [user, setUser] = useState<User>({
        id: "1",
        name: "Admin User", // Default name
        email: "admin@example.com",
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
    });

    const login = (userData: User) => {
        setUser(userData);
        // Persist to localStorage if needed
        // localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        // localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
