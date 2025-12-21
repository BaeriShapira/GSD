import { useState } from "react";
import { sendBroadcastEmail, sendTestEmail } from "../../api/adminApi";
import EmailPreview from "./EmailPreview";
import { Mail, Send, TestTube } from "lucide-react";

export default function BroadcastEmailForm() {
    const [subject, setSubject] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [sending, setSending] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);
    const [message, setMessage] = useState(null);

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

        const confirmed = window.confirm(
            "Are you sure you want to send this email to ALL users? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setSending(true);
            setMessage(null);
            const result = await sendBroadcastEmail(subject, htmlContent);
            setMessage({
                type: "success",
                text: `Broadcast email sent successfully to ${result.recipientCount} users!`,
            });
            // Clear form after successful broadcast
            setSubject("");
            setHtmlContent("");
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Form Section */}
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Mail size={24} className="text-black/60" />
                    <h2>Broadcast Email</h2>
                </div>

                <p className="text-black/60 mb-6">
                    Send an email to all registered users. Use the test button to send a preview to
                    yourself first.
                </p>

                {/* Message */}
                {message && (
                    <div
                        className={`mb-4 p-4 rounded-lg ${
                            message.type === "success"
                                ? "bg-green-50 border border-green-200 text-green-800"
                                : "bg-red-50 border border-red-200 text-red-800"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Subject */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-black/80 mb-2">
                        Subject
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject"
                        className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                </div>

                {/* HTML Content */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-black/80 mb-2">
                        Email Content (HTML)
                    </label>
                    <textarea
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        placeholder="Enter HTML content for the email"
                        rows={12}
                        className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 font-mono text-sm"
                    />
                    <p className="text-xs text-black/60 mt-2">
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
                        {sending ? "Sending..." : "Send to All Users"}
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <EmailPreview subject={subject} htmlContent={htmlContent} />
        </div>
    );
}
