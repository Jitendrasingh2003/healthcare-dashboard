import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendSMS, sendEmail } from "../../../../lib/notifications";

export async function GET(req: Request) {
    return handleCron();
}

export async function POST(req: Request) {
    return handleCron();
}

async function handleCron() {
    try {
        console.log("CRON: Checking for pending follow-up reminders...");

        // Find all follow-ups that are due today or earlier and are still pending
        const now = new Date();
        const pendingFollowUps = await prisma.followUp.findMany({
            where: {
                status: "Pending",
                followUpDate: {
                    lte: now
                }
            }
        });

        if (pendingFollowUps.length === 0) {
            console.log("CRON: No pending follow-ups found.");
            return NextResponse.json({ message: "No pending reminders to send." });
        }

        const notifiedIds = [];

        for (const followUp of pendingFollowUps) {
            console.log(`\n========================================`);
            console.log(`🔔 PROCESSING REMINDER TO PATIENT: ${followUp.patientName}`);
            
            const message = `Hello ${followUp.patientName}, this is a reminder from your healthcare provider. Your doctor (${followUp.doctorName || 'Staff'}) requested a follow-up appointment with you around this time. Please contact the clinic to confirm your visit.` + (followUp.notes ? `\nNote: ${followUp.notes}` : '');
            const subject = `Follow-up Appointment Reminder - ${followUp.doctorName || 'Clinic'}`;

            // Send SMS
            if (followUp.patientPhone && followUp.patientPhone !== "Not Provided") {
                await sendSMS(followUp.patientPhone, message);
            }

            // Send Email
            if (followUp.patientEmail) {
                await sendEmail(followUp.patientEmail, subject, message);
            }

            console.log(`========================================\n`);

            notifiedIds.push(followUp.id);
        }

        // Update status to 'Notified'
        await prisma.followUp.updateMany({
            where: {
                id: { in: notifiedIds }
            },
            data: {
                status: "Notified"
            }
        });

        console.log(`CRON: Successfully sent ${notifiedIds.length} reminders.`);

        return NextResponse.json({ 
            message: `Successfully sent ${notifiedIds.length} reminders.`,
            notifiedIds 
        });

    } catch (error) {
        console.error("CRON Error:", error);
        return NextResponse.json({ error: "Failed to process follow-up reminders" }, { status: 500 });
    }
}
