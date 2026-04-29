/**
 * Generates a styled HTML print window for a patient record.
 * Call this in browser — it opens a new tab with a printable card.
 */
export function printPatientCard(patient: any) {
    const statusColor: Record<string, string> = {
        Stable: "#16a34a", Critical: "#dc2626", Observation: "#d97706", Discharged: "#2563eb",
    };
    const color = statusColor[patient.status] || "#374151";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Patient Card — ${patient.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; padding: 30px; color: #1e293b; }
  .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 680px; margin: 0 auto; overflow: hidden; }
  .header { background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 24px 28px; display: flex; align-items: center; gap: 16px; }
  .avatar { width: 60px; height: 60px; border-radius: 14px; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.4); }
  .header-info h1 { font-size: 20px; font-weight: 700; color: #fff; }
  .header-info p { font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 2px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.35); margin-top: 6px; }
  .body { padding: 24px 28px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .field { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }
  .field label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 4px; }
  .field p { font-size: 13px; font-weight: 600; color: #1e293b; }
  .section-title { font-size: 13px; font-weight: 700; color: #475569; margin: 18px 0 10px; display: flex; align-items: center; gap: 6px; }
  .section-title::before { content: ''; width: 3px; height: 14px; background: #0d9488; border-radius: 2px; display: block; }
  .text-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 12px; color: #475569; line-height: 1.6; min-height: 56px; }
  .footer { border-top: 1px solid #f1f5f9; padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; }
  .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${color}; margin-right: 6px; }
  @media print { body { background: #fff; padding: 0; } .card { box-shadow: none; border-radius: 0; } }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="avatar">${patient.name.split(" ").map((n: string) => n[0]).join("")}</div>
    <div class="header-info">
      <h1>${patient.name}</h1>
      <p>${patient.gender} &bull; ${patient.age} years &bull; Blood Group: <strong style="color:#fff">${patient.blood}</strong></p>
      <span class="badge"><span class="status-dot"></span>${patient.status}</span>
    </div>
    <div style="margin-left:auto;text-align:right">
      <p style="font-size:11px;color:rgba(255,255,255,0.7)">Admitted</p>
      <p style="font-size:13px;font-weight:700;color:#fff">${new Date(patient.admittedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
    </div>
  </div>

  <div class="body">
    <div class="grid">
      <div class="field"><label>Department</label><p>${patient.dept || "—"}</p></div>
      <div class="field"><label>Doctor</label><p>${patient.doctor || "—"}</p></div>
      <div class="field"><label>Bed No.</label><p>${patient.bedNo || "N/A"}</p></div>
      <div class="field"><label>Phone</label><p>${patient.phone || "—"}</p></div>
      ${patient.weight ? `<div class="field"><label>Weight</label><p>${patient.weight}</p></div>` : ""}
      ${patient.height ? `<div class="field"><label>Height</label><p>${patient.height}</p></div>` : ""}
    </div>

    <div class="section-title">Diagnosis</div>
    <div class="text-block">${patient.diagnosis || "No diagnosis recorded."}</div>

    <div class="section-title">Doctor's Notes</div>
    <div class="text-block">${patient.notes || "No notes recorded."}</div>
  </div>

  <div class="footer">
    <span>City General Hospital &bull; NABH Accredited</span>
    <span>Printed: ${new Date().toLocaleString("en-IN")}</span>
  </div>
</div>
<script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=800,height=700");
    if (win) {
        win.document.write(html);
        win.document.close();
    }
}

/**
 * Generates a styled HTML print window for a doctor profile.
 */
export function printDoctorCard(doctor: any) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Doctor Profile — ${doctor.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; padding: 30px; color: #1e293b; }
  .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 680px; margin: 0 auto; overflow: hidden; }
  .header { background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 24px 28px; display: flex; align-items: center; gap: 16px; }
  .avatar { width: 60px; height: 60px; border-radius: 14px; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.4); }
  .header-info h1 { font-size: 20px; font-weight: 700; color: #fff; }
  .header-info p { font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 2px; }
  .body { padding: 24px 28px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }
  .field label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 4px; }
  .field p { font-size: 13px; font-weight: 600; color: #1e293b; }
  .footer { border-top: 1px solid #f1f5f9; padding: 14px 28px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
  @media print { body { background: #fff; padding: 0; } .card { box-shadow: none; } }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="avatar">${doctor.name.split(" ").slice(1).map((n: string) => n[0]).join("") || doctor.name[0]}</div>
    <div class="header-info">
      <h1>${doctor.name}</h1>
      <p>${doctor.dept} &bull; ${doctor.education || "—"}</p>
      <p style="margin-top:6px;font-size:11px;color:rgba(255,255,255,0.7)">${doctor.shift} Shift &bull; ${doctor.exp} Experience &bull; Rating: ${doctor.rating}⭐</p>
    </div>
  </div>
  <div class="body">
    <div class="grid">
      <div class="field"><label>Phone</label><p>${doctor.phone}</p></div>
      <div class="field"><label>Email</label><p>${doctor.email}</p></div>
      <div class="field"><label>Status</label><p>${doctor.status}</p></div>
      <div class="field"><label>Total Patients</label><p>${doctor.patients}</p></div>
    </div>
  </div>
  <div class="footer">
    <span>City General Hospital &bull; NABH Accredited</span>
    <span>Printed: ${new Date().toLocaleString("en-IN")}</span>
  </div>
</div>
<script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=800,height=600");
    if (win) { win.document.write(html); win.document.close(); }
}
