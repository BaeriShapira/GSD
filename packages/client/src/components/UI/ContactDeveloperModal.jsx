import { useState } from "react";
import { createPortal } from "react-dom";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "./Modal";
import { apiSendContactMessage } from "../../api/contactApi";

export default function ContactDeveloperModal({ isOpen, onClose }) {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState("");

    function handleClose() {
        setSubject("");
        setMessage("");
        setStatus(null);
        setErrorMessage("");
        onClose();
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!subject.trim()) {
            setErrorMessage("Please enter a subject");
            return;
        }

        if (!message.trim()) {
            setErrorMessage("Please enter a message");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await apiSendContactMessage({
                subject: subject.trim(),
                message: message.trim(),
            });

            if (response.success) {
                setStatus("success");
                setTimeout(() => {
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage(error.message || "Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const modalContent = (
        <Modal isOpen={isOpen} onClose={handleClose} title="Contact Developer">
            {status === "success" ? (
                <div className="text-center py-8">
                    <CheckCircle size={48} className="mx-auto text-brand-primary mb-4" />
                    <h3 className="text-lg font-semibold text-brand-primary mb-2">
                        Message Sent!
                    </h3>
                    <p className="text-sm text-black/60">
                        Thank you for reaching out. We'll get back to you soon.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black/80 mb-1">
                            Subject *
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Brief description of your inquiry"
                            className="input"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black/80 mb-1">
                            Message *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us more about your question, issue, or feedback..."
                            className="input min-h-[120px] resize-y"
                            rows={5}
                            disabled={isLoading}
                        />
                    </div>

                    {errorMessage && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-red-600">{errorMessage}</p>
                        </div>
                    )}

                    <p className="text-xs text-black/50">
                        Your email and name will be included automatically so we can respond to you.
                    </p>

                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-outline"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || !subject.trim() || !message.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block animate-spin mr-2">⏳</span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );

    return isOpen ? createPortal(modalContent, document.body) : null;
}
