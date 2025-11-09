"use client";

import { useEffect, useState } from "react";
import UserServices from "@/services/UserServices";

export function useUser(token) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoadingUser(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await UserServices.getCurrentUser(token);
                if (res?.success) {
                    setUser(res.data);
                } else {
                    setUser(null);
                    setError("Invalid token");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setUser(null);
                setError("Failed to fetch user");
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, [token]);

    return { user, loadingUser, error };
}
