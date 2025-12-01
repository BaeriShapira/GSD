import { fetchWithAuth } from "./apiClient";

export async function fetchFolders() {
    const res = await fetchWithAuth("/folders");
    if (!res.ok) throw new Error("Failed to load folders");
    return res.json();
}

export async function createFolder(name) {
    const res = await fetchWithAuth("/folders", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create folder");
    return res.json();
}

export async function updateFolder(id, name) {
    const res = await fetchWithAuth(`/folders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to update folder");
    return res.json();
}

export async function deleteFolder(id) {
    const res = await fetchWithAuth(`/folders/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete folder");
    }
}
