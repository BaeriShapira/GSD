import { useState, useEffect } from "react";
import { sendBroadcastEmail, sendTestEmail, getAllUsers, getMostActiveUsers } from "../../api/adminApi";
import EmailPreview from "./EmailPreview";
import { Mail, Send, TestTube } from "lucide-react";

export default function BroadcastEmailForm() {
    const [subject, setSubject] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [sending, setSending] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);
    const [message, setMessage] = useState(null);

    const [recipientType, setRecipientType] = useState("all");
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [topActiveCount, setTopActiveCount] = useState(10);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        if (recipientType === "selected") {
            loadAllUsers();
        }
    }, [recipientType]);

    const loadAllUsers = async () => {
        try {
            setLoadingUsers(true);
            const users = await getAllUsers();
            setAllUsers(users);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleUserSelect = (userId) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUserIds.length === allUsers.length) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(allUsers.map((u) => u.id));
        }
    };

    const handleSendTest = async () => {
        if (!subject.trim() || !htmlContent.trim()) {
            setMessage({ type: "error", text: "Please fill in both subject and content" });
            return;
        }

        try {
            setSendingTest(true);
            setMessage(null);
            await sendTestEmail(subject, htmlContent);
            setMessage({ type: "success", text: "Test email sent successfully! Check your inbox." });
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSendingTest(false);
        }
    };

    const handleSendBroadcast = async () => {
        if (!subject.trim() || !htmlContent.trim()) {
            setMessage({ type: "error", text: "Please fill in both subject and content" });
            return;
        }

        if (recipientType === "selected" && selectedUserIds.length === 0) {
            setMessage({ type: "error", text: "Please select at least one user" });
            return;
        }

        let confirmMessage = "Are you sure you want to send this email to ";
        if (recipientType === "all") {
            confirmMessage += "ALL users?";
        } else if (recipientType === "selected") {
            confirmMessage += `${selectedUserIds.length} selected user(s)?`;
        } else if (recipientType === "topActive") {
            confirmMessage += `the top ${topActiveCount} most active users?`;
        }
        confirmMessage += " This action cannot be undone.";

        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;

        try {
            setSending(true);
            setMessage(null);
            const result = await sendBroadcastEmail(
                subject,
                htmlContent,
                recipientType,
                selectedUserIds,
                topActiveCount
            );
            setMessage({
                type: "success",
                text: `Broadcast email sent successfully to ${result.recipientCount} users!`,
            });
            // Clear form after successful broadcast
            setSubject("");
            setHtmlContent("");
            setSelectedUserIds([]);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Form Section */}
            <div className="border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Mail size={24} className="text-black/60 dark:text-white/60" />
                    <h2>Broadcast Email</h2>
                </div>

                <p className="text-black/60 dark:text-dark-text-secondary mb-6">
                    Send an email to all users, selected users, or most active users. Use the test
                    button to send a preview to yourself first.
                </p>

                {/* Message */}
                {message && (
                    <div
                        className={`mb-4 p-4 rounded-lg ${
                            message.type === "success"
                                ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300"
                                : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Recipient Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black/80 dark:text-white mb-2">
                        Send To
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="recipientType"
                                value="all"
                                checked={recipientType === "all"}
                                onChange={(e) => setRecipientType(e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-black/80 dark:text-white">All Users</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="recipientType"
                                value="selected"
                                checked={recipientType === "selected"}
                                onChange={(e) => setRecipientType(e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-black/80 dark:text-white">Selected Users</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="recipientType"
                                value="topActive"
                                checked={recipientType === "topActive"}
                                onChange={(e) => setRecipientType(e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-black/80 dark:text-white">Most Active Users</span>
                        </label>
                    </div>
                </div>

                {/* Selected Users */}
                {recipientType === "selected" && (
                    <div className="mb-4 border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-black/80 dark:text-white">
                                Select Users ({selectedUserIds.length} selected)
                            </p>
                            <button
                                onClick={handleSelectAll}
                                className="text-sm text-purple-950 dark:text-purple-300 hover:underline"
                            >
                                {selectedUserIds.length === allUsers.length ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                        {loadingUsers && <p className="text-sm text-black/60 dark:text-dark-text-secondary">Loading users...</p>}
                        {!loadingUsers && allUsers.length > 0 && (
                            <div className="max-h-60 overflow-y-auto space-y-1">
                                {allUsers.map((user) => (
                                    <label key={user.id} className="flex items-center gap-2 cursor-pointer py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedUserIds.includes(user.id)}
                                            onChange={() => handleUserSelect(user.id)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-black/80 dark:text-white">
                                            {user.name || "N/A"} ({user.email})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Top Active Count */}
                {recipientType === "topActive" && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black/80 dark:text-white mb-2">
                            Number of Most Active Users
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={topActiveCount}
                            onChange={(e) => setTopActiveCount(parseInt(e.target.value) || 10)}
                            className="w-full px-4 py-2 border border-black/10 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                        />
                    </div>
                )}

                {/* Subject */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black/80 dark:text-white mb-2">
                        Subject
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject"
                        className="w-full px-4 py-2 border border-black/10 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                </div>

                {/* HTML Content */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-black/80 dark:text-white mb-2">
                        Email Content (HTML)
                    </label>
                    <textarea
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        placeholder="Enter HTML content for the email"
                        rows={12}
                        className="w-full px-4 py-2 border border-black/10 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 font-mono text-sm"
                    />
                    <p className="text-xs text-black/60 dark:text-dark-text-secondary mt-2">
                        You can use HTML tags for formatting. The email will be sent as-is.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSendTest}
                        disabled={sendingTest || sending}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <TestTube size={16} />
                        {sendingTest ? "Sending Test..." : "Send Test to Me"}
                    </button>
                    <button
                        onClick={handleSendBroadcast}
                        disabled={sending || sendingTest}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Send size={16} />
                        {sending ? "Sending..." : "Send Broadcast"}
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <EmailPreview subject={subject} htmlContent={htmlContent} />
        </div>
    );
}
