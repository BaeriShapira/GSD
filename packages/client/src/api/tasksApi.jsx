import { fetchWithAuth } from "./apiClient";

export async function fetchTasks(status = "INBOX") {
    const query = status ? `?status=${status}` : "";
    const res = await fetchWithAuth(`/tasks${query}`);
    if (!res.ok) throw new Error("Failed to load tasks");
    return res.json();
}

export async function createTask(data) {
    // תמיכה לאחור - אם זה סטרינג, זה טקסט
    if (typeof data === "string") {
        const body = { text: data };

        const res = await fetchWithAuth("/tasks", {
            method: "POST",
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Failed to create task");
        return res.json();
    }

    const { text, files = [], ...rest } = data || {};

    // אם אין קבצים – שולחים כ-JSON רגיל (כמו היום)
    if (!files || files.length === 0) {
        const body = { text, ...rest };

        const res = await fetchWithAuth("/tasks", {
            method: "POST",
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Failed to create task");
        return res.json();
    }

    // אם יש קבצים – FormData
    const formData = new FormData();
    if (text != null) formData.append("text", text);

    // אם יש שדות נוספים (למשל status), נוסיף גם אותם
    Object.entries(rest).forEach(([key, value]) => {
        if (value != null) {
            formData.append(key, value);
        }
    });

    files.forEach(file => {
        formData.append("files", file); // השם "files" צריך להתאים לבקאנד
    });

    const res = await fetchWithAuth("/tasks", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
}

export async function updateTask(id, updates) {
    // תמיכה לאחור - אם זה סטרינג, זה טקסט
    if (typeof updates === "string") {
        const body = { text: updates };
        const res = await fetchWithAuth(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
    }

    const { files = [], ...rest } = updates || {};

    // אם אין קבצים – שולחים כ-JSON רגיל
    if (!files || files.length === 0) {
        const res = await fetchWithAuth(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(rest),
        });
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
    }

    // אם יש קבצים – FormData
    const formData = new FormData();

    // אם יש שדות נוספים, נוסיף גם אותם
    Object.entries(rest).forEach(([key, value]) => {
        if (value != null) {
            formData.append(key, value);
        }
    });

    files.forEach(file => {
        formData.append("files", file); // השם "files" צריך להתאים לבקאנד
    });

    const res = await fetchWithAuth(`/tasks/${id}`, {
        method: "PUT",
        body: formData,
    });

    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
}

export async function deleteTask(id) {
    const res = await fetchWithAuth(`/tasks/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
}

export async function bulkUpdateTasksOrder(updates) {
    const res = await fetchWithAuth("/tasks/bulk-update-order", {
        method: "POST",
        body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error("Failed to update tasks order");
    return res.json();
}
