/**
 * Email Service using Resend API
 *
 * All emails are sent through Resend for reliability and deliverability.
 * Requires RESEND_API_KEY environment variable in production.
 * In development mode (without API key), emails are logged to console.
 */

/**
 * Send email verification email (currently not used - users are auto-verified)
 */
export async function sendVerificationEmail(email, token) {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log(`📧 [DEV MODE] Verification email would be sent to: ${email}`);
        console.log(`📧 [DEV MODE] Verification URL: ${process.env.CLIENT_URL}/verify-email/${token}`);
        return { success: true, dev: true };
    }

    // Lazy load Resend to avoid loading it in dev mode
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Verify your email address</h2>
            <p style="color: #666; line-height: 1.6;">
                Thank you for signing up for GSD. Please verify your email address by clicking the button below:
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
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: `GSD <noreply@gsdapp.dev>`,
            to: [email],
            subject: "Verify your email address",
            html: htmlContent,
        });

        if (error) {
            console.error("❌ Resend error (verification email):", error);
            throw new Error("Failed to send verification email");
        }

        console.log(`✅ Verification email sent to: ${email} (ID: ${data.id})`);
        return { success: true, id: data.id };
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}

/**
 * Send password reset email (currently not used)
 */
export async function sendPasswordResetEmail(email, token) {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log(`📧 [DEV MODE] Password reset email would be sent to: ${email}`);
        console.log(`📧 [DEV MODE] Reset URL: ${process.env.CLIENT_URL}/reset-password/${token}`);
        return { success: true, dev: true };
    }

    // Lazy load Resend to avoid loading it in dev mode
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const htmlContent = `
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
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: `GSD <noreply@gsdapp.dev>`,
            to: [email],
            subject: "Reset your password",
            html: htmlContent,
        });

        if (error) {
            console.error("❌ Resend error (password reset):", error);
            throw new Error("Failed to send password reset email");
        }

        console.log(`✅ Password reset email sent to: ${email} (ID: ${data.id})`);
        return { success: true, id: data.id };
    } catch (error) {
        console.error("❌ Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email, name) {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log(`📧 [DEV MODE] Welcome email would be sent to: ${email}`);
        return { success: true, dev: true };
    }

    // Lazy load Resend to avoid loading it in dev mode
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Hey,</p>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                I saw you signed up for GSD welcome!<br>
                I'm really glad you're trying it out.
            </p>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                I'm here for any question, feedback, or bug you might run into.<br>
                You can just reply to this email and I'll get back to you.
            </p>

            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Baeri
            </p>
        </div>
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: `Baeri from GSD <onboarding@gsdapp.dev>`,
            to: [email],
            replyTo: "gsd.app.dev@gmail.com",
            subject: "Welcome to GSD",
            html: htmlContent,
        });

        if (error) {
            console.error("❌ Resend error (welcome email):", error);
            // Don't throw - we don't want to fail registration if email fails
            return { success: false, error: error.message };
        }

        console.log(`✅ Welcome email sent to: ${email} (ID: ${data.id})`);
        return { success: true, id: data.id };
    } catch (error) {
        console.error("❌ Error sending welcome email:", error);
        // Don't throw - we don't want to fail registration if email fails
        return { success: false, error: error.message };
    }
}

/**
 * Send new user notification to admin
 */
export async function sendNewUserNotification(userEmail, userName, userId) {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log(`📧 [DEV MODE] New user notification would be sent for: ${userEmail}`);
        return { success: true, dev: true };
    }

    // Lazy load Resend to avoid loading it in dev mode
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">New User Registered! 🎉</h1>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${userName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
                <p style="margin: 5px 0;"><strong>User ID:</strong> ${userId}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <p style="font-size: 14px; color: #888; margin-top: 30px;">
                This is an automated notification from your GSD application.
            </p>
        </div>
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: `GSD Notifications <noreply@gsdapp.dev>`,
            to: ["gsd.app.dev@gmail.com"],
            subject: `New User Registration: ${userName}`,
            html: htmlContent,
        });

        if (error) {
            console.error("❌ Resend error (admin notification):", error);
            // Don't throw - we don't want to fail registration if email fails
            return { success: false, error: error.message };
        }

        console.log(`✅ Admin notification sent for new user: ${userEmail} (ID: ${data.id})`);
        return { success: true, id: data.id };
    } catch (error) {
        console.error("❌ Error sending admin notification:", error);
        // Don't throw - we don't want to fail registration if email fails
        return { success: false, error: error.message };
    }
}

/**
 * Send broadcast email to multiple users
 */
export async function sendBroadcastEmail(users, subject, htmlContent) {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log(`📧 [DEV MODE] Broadcast email would be sent to ${users.length} users`);
        console.log(`📧 Subject: ${subject}`);
        console.log(`📧 Content preview: ${htmlContent.substring(0, 100)}...`);
        return { success: true, dev: true };
    }

    // Lazy load Resend to avoid loading it in dev mode
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        // Send emails one by one to allow personalization
        const results = [];
        for (const user of users) {
            try {
                const { data, error } = await resend.emails.send({
                    from: `Baeri from GSD <onboarding@gsdapp.dev>`,
                    to: [user.email],
                    replyTo: "gsd.app.dev@gmail.com",
                    subject: subject,
                    html: htmlContent,
                });

                if (error) {
                    console.error(`❌ Failed to send to ${user.email}:`, error);
                    results.push({ email: user.email, success: false, error });
                } else {
                    console.log(`✅ Email sent to: ${user.email} (ID: ${data.id})`);
                    results.push({ email: user.email, success: true, id: data.id });
                }
            } catch (emailError) {
                console.error(`❌ Error sending to ${user.email}:`, emailError);
                results.push({ email: user.email, success: false, error: emailError.message });
            }
        }

        const successCount = results.filter((r) => r.success).length;
        console.log(`✅ Broadcast complete: ${successCount}/${users.length} sent successfully`);

        return { success: true, results, totalSent: successCount, totalUsers: users.length };
    } catch (error) {
        console.error("❌ Error sending broadcast email:", error);
        throw new Error("Failed to send broadcast email");
    }
}

/**
 * Send contact message to developer using Resend API
 */
export async function sendContactEmail({ fromEmail, fromName, subject, message }) {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log(`📧 [DEV MODE] Contact from: ${fromEmail} (${fromName})`);
        console.log(`📧 Subject: ${subject}`);
        console.log(`📧 Message: ${message}`);
        return { success: true, dev: true };
    }

    // Lazy load Resend to avoid loading it in dev mode
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = `
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
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: `${process.env.APP_NAME || "GSD App"} <noreply@gsdapp.dev>`,
            to: ["gsd.app.dev@gmail.com"],
            replyTo: fromEmail,
            subject: `[GSD Contact] ${subject}`,
            html: htmlContent,
        });

        if (error) {
            console.error("❌ Resend error:", error);
            throw new Error(error.message || "Failed to send email via Resend");
        }

        console.log(`✅ Contact email sent from: ${fromEmail} (ID: ${data.id})`);
        return { success: true, id: data.id };
    } catch (error) {
        console.error("❌ Error sending contact email:", error);
        throw new Error("Failed to send contact message. Please try again later.");
    }
}
