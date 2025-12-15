import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

// Create transporter for sending emails
let transporter = null;

function getTransporter() {
    if (!transporter) {
        // Check if SMTP is configured
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            console.warn("⚠️  SMTP not configured. Email sending will be disabled.");
            return null;
        }

        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email, token) {
    const transport = getTransporter();

    if (!transport) {
        console.log(`📧 [DEV MODE] Verification email would be sent to: ${email}`);
        console.log(`📧 [DEV MODE] Verification URL: ${process.env.CLIENT_URL}/verify-email/${token}`);
        return { success: true, dev: true };
    }

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const mailOptions = {
        from: `"${process.env.APP_NAME || "GSD App"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify your email address",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to ${process.env.APP_NAME || "GSD App"}!</h2>
                <p style="color: #666; line-height: 1.6;">
                    Thank you for signing up. Please verify your email address by clicking the button below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}"
                       style="background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #999; font-size: 12px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${verificationUrl}" style="color: #666;">${verificationUrl}</a>
                </p>
                <p style="color: #999; font-size: 12px;">
                    This link will expire in 24 hours.
                </p>
                <p style="color: #999; font-size: 12px;">
                    If you didn't create an account, you can safely ignore this email.
                </p>
            </div>
        `,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`✅ Verification email sent to: ${email}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}

/**
 * Send password reset email (for future use)
 */
export async function sendPasswordResetEmail(email, token) {
    const transport = getTransporter();

    if (!transport) {
        console.log(`📧 [DEV MODE] Password reset email would be sent to: ${email}`);
        console.log(`📧 [DEV MODE] Reset URL: ${process.env.CLIENT_URL}/reset-password/${token}`);
        return { success: true, dev: true };
    }

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
        from: `"${process.env.APP_NAME || "GSD App"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: "Reset your password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Reset Your Password</h2>
                <p style="color: #666; line-height: 1.6;">
                    You requested to reset your password. Click the button below to create a new password:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}"
                       style="background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #999; font-size: 12px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${resetUrl}" style="color: #666;">${resetUrl}</a>
                </p>
                <p style="color: #999; font-size: 12px;">
                    This link will expire in 24 hours.
                </p>
                <p style="color: #999; font-size: 12px;">
                    If you didn't request a password reset, you can safely ignore this email.
                </p>
            </div>
        `,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to: ${email}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
}

/**
 * Send contact message to developer
 */
export async function sendContactEmail({ fromEmail, fromName, subject, message }) {
    const transport = getTransporter();

    if (!transport) {
        console.log(`📧 [DEV MODE] Contact from: ${fromEmail} (${fromName})`);
        console.log(`📧 Subject: ${subject}`);
        console.log(`📧 Message: ${message}`);
        return { success: true, dev: true };
    }

    const mailOptions = {
        from: `"${process.env.APP_NAME || "GSD App"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: "gsd.app.dev@gmail.com",
        replyTo: fromEmail,
        subject: `[GSD Contact] ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #003311;">Contact Form Message</h2>

                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>From:</strong> ${fromName}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${fromEmail}</p>
                    <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                </div>

                <div style="margin: 20px 0;">
                    <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
                    <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>

                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
                <p style="color: #999; font-size: 12px;">
                    This message was sent through the GSD App contact form.
                </p>
            </div>
        `,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`✅ Contact email sent from: ${fromEmail}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending contact email:", error);
        throw new Error("Failed to send contact message. Please try again later.");
    }
}
