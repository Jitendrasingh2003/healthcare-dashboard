import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Twilio Config
let twilioClient: any = null;
try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
        twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
} catch (e) {
    console.warn("⚠️ Invalid Twilio credentials provided. SMS will be mocked.");
}

// Nodemailer Config
const emailTransporter = process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })
    : null;

/**
 * Sends an SMS to a patient using Twilio.
 */
export async function sendSMS(to: string, message: string) {
    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
        console.warn("⚠️ Twilio is not configured in .env. Mocking SMS to:", to);
        console.log(`💬 Message: ${message}`);
        return { success: true, mock: true };
    }

    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to.startsWith('+') ? to : `+91${to}`, // Defaulting to +91 (India) if no country code
        });
        console.log(`✅ SMS sent successfully to ${to}. SID: ${result.sid}`);
        return { success: true, sid: result.sid };
    } catch (error: any) {
        console.error(`❌ Failed to send SMS to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Sends an Email to a patient using Nodemailer.
 */
export async function sendEmail(to: string, subject: string, text: string) {
    if (!emailTransporter || !process.env.EMAIL_USER) {
        console.warn("⚠️ Email is not configured in .env. Mocking Email to:", to);
        console.log(`📧 Subject: ${subject}\nBody:\n${text}`);
        return { success: true, mock: true };
    }

    try {
        const info = await emailTransporter.sendMail({
            from: `"Healthcare Clinic" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log(`✅ Email sent successfully to ${to}. MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`❌ Failed to send Email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
}
