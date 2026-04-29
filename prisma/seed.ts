import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
    console.log("Seeding database...");

    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();

    await prisma.patient.createMany({
        data: [
            { name: "Rahul Agarwal", age: 45, gender: "Male", blood: "B+", phone: "9876543210", email: "rahul@gmail.com", address: "123, Civil Lines, Jaipur", dept: "Cardiology", doctor: "Dr. Mehta", status: "Stable", bedNo: "C-204", weight: "72 kg", height: "5'9\"", diagnosis: "Hypertension with mild cardiac dysfunction", notes: "Patient responding well to medication." },
            { name: "Priya Sharma", age: 62, gender: "Female", blood: "O+", phone: "9812345678", email: "priya@gmail.com", address: "45, Malviya Nagar, Jaipur", dept: "Neurology", doctor: "Dr. Verma", status: "Critical", bedNo: "ICU-02", weight: "58 kg", height: "5'4\"", diagnosis: "Acute ischemic stroke", notes: "Patient in ICU. Continuous monitoring required." },
            { name: "Arjun Kumar", age: 34, gender: "Male", blood: "A+", phone: "9898989898", email: "arjun@gmail.com", address: "78, Vaishali Nagar, Jaipur", dept: "Orthopedics", doctor: "Dr. Singh", status: "Observation", bedNo: "O-108", weight: "80 kg", height: "5'11\"", diagnosis: "Fracture of right femur", notes: "Post surgery recovery going well." },
            { name: "Sunita Mishra", age: 55, gender: "Female", blood: "AB+", phone: "9711111111", email: "sunita@gmail.com", address: "12, Tonk Road, Jaipur", dept: "Pediatrics", doctor: "Dr. Joshi", status: "Discharged", bedNo: "", weight: "65 kg", height: "5'5\"", diagnosis: "Viral fever", notes: "Patient discharged. Follow up in 1 week." },
            { name: "Vikas Gupta", age: 28, gender: "Male", blood: "B-", phone: "9654321098", email: "vikas@gmail.com", address: "56, Mansarovar, Jaipur", dept: "Cardiology", doctor: "Dr. Mehta", status: "Stable", bedNo: "C-210", weight: "70 kg", height: "5'8\"", diagnosis: "Mild arrhythmia", notes: "ECG monitoring daily." },
            { name: "Anita Patel", age: 40, gender: "Female", blood: "O-", phone: "9512345678", email: "anita@gmail.com", address: "89, Pratap Nagar, Jaipur", dept: "Neurology", doctor: "Dr. Verma", status: "Stable", bedNo: "N-105", weight: "62 kg", height: "5'3\"", diagnosis: "Migraine with aura", notes: "Responding to medication." },
            { name: "Rohit Jain", age: 52, gender: "Male", blood: "A-", phone: "9432123456", email: "rohit@gmail.com", address: "34, Sindhi Camp, Jaipur", dept: "Orthopedics", doctor: "Dr. Singh", status: "Critical", bedNo: "ICU-05", weight: "85 kg", height: "5'10\"", diagnosis: "Spinal cord injury", notes: "Surgery scheduled tomorrow." },
            { name: "Kavita Singh", age: 38, gender: "Female", blood: "B+", phone: "9312312312", email: "kavita@gmail.com", address: "67, Raja Park, Jaipur", dept: "Pediatrics", doctor: "Dr. Joshi", status: "Observation", bedNo: "P-202", weight: "58 kg", height: "5'4\"", diagnosis: "Appendicitis post surgery", notes: "Recovery normal." },
        ],
    });

    await prisma.doctor.createMany({
        data: [
            { name: "Dr. Rajesh Mehta", dept: "Cardiology", exp: "15 yrs", phone: "9876501234", email: "mehta@hospital.com", status: "On Duty", shift: "Morning", rating: 4.8, patients: 42, education: "MBBS - AIIMS Delhi, MD Cardiology - PGI Chandigarh", address: "12, Doctors Colony, Jaipur" },
            { name: "Dr. Sunita Verma", dept: "Neurology", exp: "12 yrs", phone: "9812300678", email: "verma@hospital.com", status: "On Duty", shift: "Morning", rating: 4.9, patients: 38, education: "MBBS - Grant Medical College, DM Neurology - NIMHANS", address: "34, Medical Colony, Jaipur" },
            { name: "Dr. Amit Singh", dept: "Orthopedics", exp: "10 yrs", phone: "9898900898", email: "singh@hospital.com", status: "Off Duty", shift: "Evening", rating: 4.7, patients: 31, education: "MBBS - SMS Medical College, MS Orthopedics - AIIMS", address: "45, Civil Lines, Jaipur" },
            { name: "Dr. Priya Joshi", dept: "Pediatrics", exp: "8 yrs", phone: "9711100111", email: "joshi@hospital.com", status: "On Duty", shift: "Morning", rating: 4.9, patients: 55, education: "MBBS - RNT Medical College, MD Pediatrics - PGI", address: "78, Vaishali Nagar, Jaipur" },
            { name: "Dr. Vikram Rao", dept: "Cardiology", exp: "20 yrs", phone: "9654001098", email: "rao@hospital.com", status: "On Duty", shift: "Evening", rating: 4.6, patients: 48, education: "MBBS - Maulana Azad, DM Cardiology - AIIMS", address: "90, Tonk Road, Jaipur" },
            { name: "Dr. Meena Sharma", dept: "Neurology", exp: "9 yrs", phone: "9512345000", email: "sharma@hospital.com", status: "Off Duty", shift: "Night", rating: 4.5, patients: 29, education: "MBBS - SMS Medical College, DM Neurology - NIMHANS", address: "23, Mansarovar, Jaipur" },
            { name: "Dr. Suresh Patel", dept: "Orthopedics", exp: "14 yrs", phone: "9432100456", email: "patel@hospital.com", status: "On Duty", shift: "Morning", rating: 4.7, patients: 36, education: "MBBS - JLN Medical College, MS Orthopedics - PGI", address: "56, Pratap Nagar, Jaipur" },
            { name: "Dr. Anita Gupta", dept: "Pediatrics", exp: "11 yrs", phone: "9312300312", email: "gupta@hospital.com", status: "Off Duty", shift: "Evening", rating: 4.8, patients: 44, education: "MBBS - RUHS, MD Pediatrics - AIIMS Delhi", address: "34, Raja Park, Jaipur" },
        ],
    });

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });