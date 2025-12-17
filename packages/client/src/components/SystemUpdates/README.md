# System Updates

This directory contains all components and utilities for managing and displaying system updates to users.

## Files

- **`UpdatesModal.jsx`** - The modal component that displays system updates to users
- **`systemUpdates.js`** - The data file where you manage all system updates
- **`README.md`** - This file

## How to Add a New Update

1. Open `systemUpdates.js`
2. Add a new update object at the **top** of the `systemUpdates` array
3. Follow this format:

```javascript
{
    id: "update-YYYY-MM-DD-N",     // Unique ID (date + number if multiple per day)
    date: "YYYY-MM-DD",             // Release date
    version: "X.Y.Z",               // Version number (optional)
    title: "Update Title",          // Short descriptive title
    items: [                        // Array of bullet points
        "First improvement or feature",
        "Second improvement or feature",
        "Third bug fix",
    ]
}
```

## Example

```javascript
export const systemUpdates = [
    {
        id: "update-2025-12-18-1",
        date: "2025-12-18",
        version: "1.2.0",
        title: "New Features and Improvements",
        items: [
            "Added PDF export functionality for tasks",
            "Improved mobile responsiveness on tablets",
            "Fixed bug with date picker on Safari",
            "Performance improvements for large task lists",
        ]
    },
    // ... previous updates
];
```

## How It Works

1. **User Notification**: When you add a new update, users will see a red notification dot on their avatar in the sidebar
2. **Viewing Updates**: When users click "System Updates" in their menu, they'll see all updates in a modal
3. **Marking as Read**: Once viewed, the update is marked as read in localStorage and the red dot disappears
4. **Latest Badge**: The most recent update gets a "New" badge

## Important Notes

- Always add new updates at the **top** of the array
- Each update must have a unique `id`
- The `version` field is optional
- Updates are stored client-side, so they persist across sessions
- The red notification appears for any user who hasn't viewed the latest update
