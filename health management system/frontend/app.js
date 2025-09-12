// app.js - minimal SPA
const API = "http://127.0.0.1:5000/api";
const userId = 1;
const main = document.getElementById("main");
document.querySelectorAll("header .nav button").forEach(btn => {
  btn.addEventListener("click", () => loadPage(btn.dataset.page));
});
function loadPage(page){
  if(page === "dashboard") return renderDashboard();
  if(page === "vitals") return renderVitals();
  if(page === "symptoms") return renderSymptoms();
  if(page === "meds") return renderMeds();
  if(page === "appts") return renderAppts();
  if(page === "reports") return renderReports();
}
loadPage("dashboard");
// ---------- Dashboard ---------
async function renderDashboard(){
  main.innerHTML = `<div class="card"><h2>Dashboard</h2><div id="dash-content" class="small">Loading...</div></div>`;
  const dash = document.getElementById("dash-content");
  const res = await fetch(`${API}/vitals/${userId}`);
  const vitals = await res.json();
  dash.innerHTML = vitals.slice(0,6).map(v => `<div>${v.timestamp} — <strong>${v.type}</strong>: ${v.value} ${v.unit}</div>`).join("");
}
// ---------- Vitals ---------
function renderVitals(){
  main.innerHTML = `
    <div class="card"><h2>Vitals</h2>
      <form id="vitalForm" class="form-row">
        <input name="type" placeholder="type (bp/hr/temp)" required>
        <input name="value" placeholder="value" required>
        <input name="unit" placeholder="unit">
        <button class="primary">Add Vital</button>
      </form>
      <div id="vlist" class="small"></div>
    </div>`;
  document.getElementById("vitalForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const f = e.target;
    const body = {
      user_id: userId,
      type: f.type.value,
      value: f.value.value,
      unit: f.unit.value
    };
    await fetch(`${API}/vitals`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body)});
    f.reset(); await loadVitalsList();
  });
  loadVitalsList();
}
async function loadVitalsList(){
  const res = await fetch(`${API}/vitals/${userId}`);
  const data = await res.json();
  const container = document.getElementById("vlist");
  container.innerHTML = data.map(v => `<div class="list-item"><div><strong>${v.type}</strong> — ${v.value} ${v.unit}</div><div class="small">${v.timestamp}</div></div>`).join("");
}
// ---------- Symptoms ---------
function renderSymptoms(){
  main.innerHTML = `
    <div class="card">
      <h2>Symptoms</h2>
      <form id="symForm" class="form-row">
        <input name="name" placeholder="Symptom name" required>
        <select name="system">
          <option>Cardiovascular</option>
          <option>Respiratory</option>
          <option>Digestive</option>
          <option>Nervous</option>
        </select>
        <input name="severity" type="number" min="1" max="10" placeholder="severity 1-10" required>
        <input name="notes" placeholder="notes">
        <button class="primary">Log Symptom</button>
      </form>
      <div id="slist" class="small"></div>
    </div>`;
  document.getElementById("symForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const f = e.target;
    const body = { user_id:userId, name:f.name.value, system:f.system.value, severity:Number(f.severity.value), notes: f.notes.value };
    await fetch(`${API}/symptoms`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body)});
    f.reset(); loadSymptomsList();
  });
  loadSymptomsList();
}
async function loadSymptomsList(){
  const res = await fetch(`${API}/symptoms/${userId}`);
  const data = await res.json();
  const container = document.getElementById("slist");
  container.innerHTML = data.map(s=>`<div class="list-item"><div><strong>${s.name}</strong> (${s.system}) severity:${s.severity}</div><div class="small">${s.timestamp}</div><div>${s.notes || ''}</div></div>`).join("");
}
// ---------- Medications ---------
function renderMeds(){
  main.innerHTML = `
    <div class="card">
      <h2>Medications</h2>
      <form id="medForm" class="form-row">
        <input name="name" placeholder="Medication name" required>
        <input name="dose" placeholder="Dose (e.g., 5mg)">
        <input name="schedule" placeholder="Schedule (e.g., once daily)">
        <input name="start_date" type="date">
        <button class="primary">Add Med</button>
      </form>
      <div id="medlist" class="small"></div>
    </div>`;
  document.getElementById("medForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const f = e.target;
    const body = {
      user_id: userId,
      name: f.name.value,
      dose: f.dose.value,
      schedule: f.schedule.value,
      start_date: f.start_date.value
    };
    await fetch(`${API}/meds`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body)});
    f.reset(); loadMedsList();
  });
  loadMedsList();
}
async function loadMedsList(){
  const res = await fetch(`${API}/meds/${userId}`);
  const data = await res.json();
  document.getElementById("medlist").innerHTML = data.map(m=>`<div class="list-item"><strong>${m.name}</strong> ${m.dose} — ${m.schedule}<div class="small">start: ${m.start_date || '—'}</div></div>`).join("");
}
// ---------- Appointments ---------
function renderAppts(){
  main.innerHTML = `
    <div class="card">
      <h2>Appointments</h2>
      <form id="apptForm" class="form-row">
        <input name="doctor" placeholder="Doctor name" required>
        <input name="datetime" type="datetime-local" required>
        <select name="type"><option>in-person</option><option>telehealth</option></select>
        <input name="notes" placeholder="notes">
        <button class="primary">Book</button>
      </form>
      <div id="applist" class="small"></div>
    </div>`;
  document.getElementById("apptForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const f = e.target;
    const body = {
      user_id: userId,
      doctor: f.doctor.value,
      datetime: f.datetime.value,
      type: f.type.value,
      notes: f.notes.value
    };
    await fetch(`${API}/appointments`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body)});
    f.reset(); loadApptsList();
  });
  loadApptsList();
}
async function loadApptsList(){
  const res = await fetch(`${API}/appointments/${userId}`);
  const data = await res.json();
  document.getElementById("applist").innerHTML = data.map(a=>`<div class="list-item"><strong>${a.doctor}</strong> — ${a.datetime} <div class="small">${a.type}</div></div>`).join("");
}
// ---------- Reports ---------
function renderReports(){
  main.innerHTML = `
    <div class="card">
      <h2>Reports</h2>
      <button id="genReport" class="primary">Generate PDF Report</button>
      <div id="rmsg" class="small"></div>
    </div>`;
  document.getElementById("genReport").addEventListener("click", async ()=>{
    const url = `${API}/report/${userId}`;
    // Download PDF
    const res = await fetch(url);
    if (!res.ok) return alert('Failed to generate report');
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hms-report-user${userId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    document.getElementById("rmsg").innerText = "Report downloaded.";
  });
}
