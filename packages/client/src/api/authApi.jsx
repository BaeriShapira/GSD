import { fetchPublic } from "./apiClient";

export async function apiLogin(email, password) {
    const res = await fetchPublic("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    return res.json(); // { user, token }
}

export async function apiRegister(email, password) {
    const res = await fetchPublic("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Register failed");
    }

    return res.json(); // { user, token }
}
