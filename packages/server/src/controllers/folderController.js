import {
    listUserFolders,
    addUserFolder,
    editUserFolder,
    removeUserFolder,
} from "../services/folderService.js";

export async function getFolders(req, res, next) {
    try {
        const userId = req.user.id;
        const folders = await listUserFolders(userId);
        res.json(folders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load folders" });
    }
}

export async function createFolder(req, res, next) {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        const folder = await addUserFolder(userId, name);
        res.status(201).json(folder);
    } catch (err) {
        next(err);
    }
}

export async function updateFolder(req, res, next) {
    try {
        const userId = req.user.id;
        const folderId = req.params.id;
        const { name } = req.body;
        const folder = await editUserFolder(userId, folderId, name);
        res.json(folder);
    } catch (err) {
        next(err);
    }
}

export async function deleteFolder(req, res, next) {
    try {
        const userId = req.user.id;
        const folderId = req.params.id;
        await removeUserFolder(userId, folderId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}
