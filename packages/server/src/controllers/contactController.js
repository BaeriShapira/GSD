import { sendContactEmail } from "../services/emailService.js";

export async function sendContactMessage(req, res, next) {
    try {
        const { subject, message } = req.body;
        const user = req.user; // Set by authMiddleware

        // Validation
        if (!subject || !subject.trim()) {
            return res.status(400).json({ error: "Subject is required" });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Send email
        await sendContactEmail({
            fromEmail: user.email,
            fromName: user.displayName || user.email.split('@')[0],
            subject: subject.trim(),
            message: message.trim(),
        });

        res.json({
            success: true,
            message: "Your message has been sent successfully"
        });
    } catch (err) {
        next(err);
    }
}
