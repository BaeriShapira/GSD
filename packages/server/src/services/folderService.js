import {
    getFoldersByUserId,
    createFolderForUser,
    updateFolderForUser,
    deleteFolderForUser,
    ensureDefaultFolderExists,
} from "../repositories/folderRepository.js";

export async function listUserFolders(userId) {
    await ensureDefaultFolderExists(userId);
    return getFoldersByUserId(userId);
}

export async function addUserFolder(userId, name) {
    if (!name || !name.trim()) {
        throw new Error("Folder name is required");
    }
    return createFolderForUser(userId, name.trim());
}

export async function editUserFolder(userId, folderId, name) {
    if (!name || !name.trim()) {
        throw new Error("Folder name is required");
    }
    const updated = await updateFolderForUser(userId, folderId, name.trim());
    if (!updated) {
        const err = new Error("Folder not found");
        err.status = 404;
        throw err;
    }
    return updated;
}

export async function removeUserFolder(userId, folderId) {
    const result = await deleteFolderForUser(userId, folderId);
    if (!result || !result.success) {
        const err = new Error("Folder not found");
        err.status = 404;
        throw err;
    }
    return result;
}
