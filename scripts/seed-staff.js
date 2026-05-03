const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Delete all staff
  const deleted = await p.staff.deleteMany();
  console.log('Deleted:', deleted.count, 'staff records');

  // Re-seed with correct data
  const staff = [
    { name: "Kavita Sharma", role: "Nurse", dept: "Cardiology", shift: "Morning", phone: "98765-11111", status: "Active" },
    { name: "Mohan Lal", role: "Admin", dept: "Administration", shift: "Day", phone: "98765-22222", status: "Active" },
    { name: "Neha Gupta", role: "Lab Technician", dept: "Pathology", shift: "Morning", phone: "98765-33333", status: "Active" },
    { name: "Suresh Kumar", role: "Pharmacist", dept: "Pharmacy", shift: "Evening", phone: "98765-44444", status: "On Leave" },
    { name: "Anita Verma", role: "Nurse", dept: "Neurology", shift: "Night", phone: "98765-55555", status: "Active" },
    { name: "Ramesh Tiwari", role: "Receptionist", dept: "OPD", shift: "Morning", phone: "98765-66666", status: "Active" },
  ];

  for (const s of staff) {
    await p.staff.create({ data: s });
    console.log('Created:', s.name);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => p.$disconnect());
