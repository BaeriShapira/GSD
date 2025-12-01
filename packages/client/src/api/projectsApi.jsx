import { fetchWithAuth } from "./apiClient";

export async function fetchProjects() {
    const res = await fetchWithAuth("/projects");
    if (!res.ok) throw new Error("Failed to load projects");
    return res.json();
}

export async function createProject(name, outcome = null, areaOfLifeId = null) {
    const res = await fetchWithAuth("/projects", {
        method: "POST",
        body: JSON.stringify({ name, outcome, areaOfLifeId }),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
}

export async function updateProject(id, updates) {
    const res = await fetchWithAuth(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update project");
    return res.json();
}

export async function deleteProject(id) {
    const res = await fetchWithAuth(`/projects/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete project");
    }
}

export async function bulkUpdateProjectsOrder(updates) {
    const res = await fetchWithAuth("/projects/bulk-update-order", {
        method: "POST",
        body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error("Failed to update projects order");
    return res.json();
}
