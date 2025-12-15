import { fetchPublic, fetchWithAuth } from "./apiClient";

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

export async function apiGetMe() {
    const res = await fetchWithAuth("/auth/me");

    if (!res.ok) {
        throw new Error("Failed to get user info");
    }

    return res.json(); // user object
}

export async function apiCompleteOnboarding() {
    const response = await fetchWithAuth("/auth/complete-onboarding", {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to complete onboarding");
    }

    return response.json();
}

export async function apiCompleteTutorial(tutorialName) {
    const response = await fetchWithAuth("/auth/complete-tutorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorialName }),
    });

    if (!response.ok) {
        throw new Error("Failed to complete tutorial");
    }

    return response.json();
}
