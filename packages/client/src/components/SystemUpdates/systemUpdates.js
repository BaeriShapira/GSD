/**
 * System Updates Configuration
 *
 * Instructions for Developer:
 * 1. Add new updates to the top of the array
 * 2. Each update should have:
 *    - id: Unique identifier (use format: "update-YYYY-MM-DD-N")
 *    - date: Release date (YYYY-MM-DD format)
 *    - version: Version number (optional)
 *    - title: Short title in Hebrew
 *    - items: Array of update descriptions in Hebrew
 * 3. Users will see a red notification dot until they view the latest update
 */

export const systemUpdates = [
    {
        id: "update-2025-12-29-1",
        date: "2025-12-29",
        version: "1.7.0",
        title: "Bug Fixes & Improvements",
        items: [
            `Fixed: Timezone issues when adding tasks

• Tasks now correctly show "today" regardless of your timezone
• Users in different time zones (like Australia, Asia, etc.) will no longer see tasks added to yesterday
• The system now uses UTC midnight consistently across all timezones

---

Fixed: Missing text input in Someday modals

• You can now properly enter and edit Someday item text
• Fixed both "New Someday" and "Edit Someday" modals

---

Improved: Next Actions table

• Added sort indicator (arrows) for Urgency column
• Now consistent with other sortable columns

---

New: Auto-create Reference folders for Projects

• When adding a Reference item from a Project, a folder with the project name is automatically created in the Reference page
• All project references are now organized in their respective folders
• Makes it easier to find project-related materials

We'd love to hear your feedback! Email us at gsd.app.dev@gmail.com`,
        ]
    },
    {
        id: "update-2025-12-27-1",
        date: "2025-12-27",
        version: "1.6.0",
        title: "Edit Notes Feature",
        items: [
            `New: You can now edit your notes

Simply hover over any note and click the edit icon (pencil).

This works for:
• Daily Notes
• Weekly Notes
• Project Notes


We'd love to hear your feedback! Email us at gsd.app.dev@gmail.com`,
        ]
    },
    // {
    //     id: "update-2025-12-19-1",
    //     date: "2025-12-19",
    //     version: "1.5.0",
    //     title: "Weekly Review Feature",
    //     items: [
    //         `New: Weekly Review is here!

    //         Find it under Bucket → Weekly Review.

    //         This guided 5-step process will help you:
    //         • Review your Someday/Maybe items
    //         • Go through all your projects
    //         • Brain dump everything to Bucket
    //         • Process your entire Bucket
    //         • Plan your week with goals and time blocks

    //         GSD recommends doing this once a week to keep your system clean and your mind clear.

    //         We'd love to hear your feedback! Email us at gsd.app.dev@gmail.com`,
    //     ]
    // },
    // {
    //     id: "update-2025-12-18-1",
    //     date: "2025-12-18",
    //     version: "1.4.1",
    //     title: "Navigation & Tutorial Improvements",
    //     items: [
    //         "Fixed: When you visit gsdapp.dev while logged in, you're now sent directly to the app instead of the landing page. No more confusion!",
    //     ]
    // },
    // {
    //     id: "update-2025-12-17-2",
    //     date: "2025-12-17",
    //     version: "1.4.0",
    //     title: "Improvements and New Features",
    //     items: [
    //         `We added an Archive page under Reference.

    //         All the tasks you've already completed are stored there.
    //         You'll also find some cool stats about your progress, broken down by Areas of Life.

    //         And yeah - it's also just nice to see all the shit you've actually done.`,
    //         "We've received the required security approvals from Google, and you can now safely sync with your calendar without any concerns.",
    //     ]
    // },

    // Add more updates here...
    // Example:
    // {
    //     id: "update-2025-12-18-1",
    //     date: "2025-12-18",
    //     version: "1.2.0",
    //     title: "New Features",
    //     items: [
    //         "Added export tasks to PDF",
    //         "Support for multiple file uploads",
    //     ]
    // },
];

// Get the latest update ID
export const getLatestUpdateId = () => {
    return systemUpdates.length > 0 ? systemUpdates[0].id : null;
};

// Check if user has viewed the latest update
export const hasNewUpdates = () => {
    const latestId = getLatestUpdateId();
    if (!latestId) return false;

    const viewedId = localStorage.getItem("lastViewedUpdateId");
    return viewedId !== latestId;
};

// Mark latest update as viewed
export const markUpdatesAsViewed = () => {
    const latestId = getLatestUpdateId();
    if (latestId) {
        localStorage.setItem("lastViewedUpdateId", latestId);
    }
};
