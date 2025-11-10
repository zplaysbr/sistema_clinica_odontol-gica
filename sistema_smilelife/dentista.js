/* dentist.js - logic for dentistas.html */

// data key
const KEY_PATIENTS = "smile_patients_v1";

// run when dentistas.html loaded
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("dentistas.html")) return;
  populateDemoPatientsIfEmpty();
  renderAgenda();
  renderPatientsTable();
  setupPatientsUI();
});

// populate demo patients
function populateDemoPatientsIfEmpty() {
  const raw = localStorage.getItem(KEY_PATIENTS);
  if (raw) return;
  const demo = [
    { id: 1, nome: "João Silva", cpf: "222.222.222-22", tel: "(11) 99999-0000", email: "joao@test.com" },
    { id: 2, nome: "Maria Souza", cpf: "333.333.333-33", tel: "(11) 98888-1234", email: "maria@test.com" }
  ];
  localStorage.setItem(KEY_PATIENTS, JSON.stringify(demo));
}

function getPatients(){
  return JSON.parse(localStorage.getItem(KEY_PATIENTS) || "[]");
}

function savePatients(list){ localStorage.setItem(KEY_PATIENTS, JSON.stringify(list)); }

// dummy agenda
function renderAgenda(){
  const demo = [
    { hora: "08:30", paciente: "João Silva", proc: "Consulta", status: "Confirmado" },
    { hora: "09:15", paciente: "Maria Souza", proc: "Limpeza", status: "Confirmado" },
    { hora: "10:00", paciente: "Pedro Ramos", proc: "Restauração", status: "Aguardando" }
  ];
  const tbody = document.getElementById("agendaDentista");
  tbody.innerHTML = "";
  demo.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.hora}</td><td>${d.paciente}</td><td>${d.proc}</td><td>${d.status}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById("mAtendimentos").textContent = demo.length;
  document.getElementById("mPendentes").textContent = demo.filter(x => x.status !== "Confirmado").length;
  document.getElementById("mProdu").textContent = "R$ " + (demo.length * 120).toFixed(2);

  const np = demo[0];
  document.getElementById("nextPatient").innerHTML = `<strong>${np.paciente}</strong><div class="small muted">${np.hora} • ${np.proc}</div>`;

  // recent
  const recent = document.getElementById("recentList");
  recent.innerHTML = "";
  demo.forEach(d => {
    const li = document.createElement("li");
    li.className = "small muted";
    li.textContent = `${d.paciente} — ${d.proc} — ${d.hora}`;
    recent.appendChild(li);
  });
}

// patients table
function renderPatientsTable(filter = "") {
  const patients = getPatients();
  const tbody = document.querySelector("#patientsTable tbody");
  tbody.innerHTML = "";
  patients.filter(p => (!filter) || p.nome.toLowerCase().includes(filter.toLowerCase())).forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.id}</td><td>${p.nome}</td><td>${p.cpf}</td><td>${p.tel}</td><td>${p.email}</td>
      <td><button class="btn ghost small" onclick="editPatient(${p.id})">Editar</button>
      <button class="btn ghost small" onclick="deletePatient(${p.id})">Excluir</button></td>`;
    tbody.appendChild(tr);
  });
}

// UI events
function setupPatientsUI(){
  document.getElementById("btnAddPatient").addEventListener("click", () => openModal());
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("savePatient").addEventListener("click", savePatientFromModal);
  document.getElementById("filterPatients").addEventListener("input", e => renderPatientsTable(e.target.value));
  document.getElementById("navPac")?.addEventListener("click", () => document.getElementById("patientsPanel").scrollIntoView({behavior:"smooth"}));
}

function openModal(editId = null){
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  document.getElementById("modalTitle").textContent = editId ? "Editar Paciente" : "Novo Paciente";
  if (editId) {
    const p = getPatients().find(x => x.id === editId);
    document.getElementById("mNome").value = p.nome;
    document.getElementById("mCpf").value = p.cpf;
    document.getElementById("mTel").value = p.tel;
    document.getElementById("mEmail").value = p.email;
    modal.dataset.editId = editId;
  } else {
    document.getElementById("mNome").value = "";
    document.getElementById("mCpf").value = "";
    document.getElementById("mTel").value = "";
    document.getElementById("mEmail").value = "";
    modal.removeAttribute("data-edit-id");
  }
}

function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}

function savePatientFromModal(){
  const nome = document.getElementById("mNome").value.trim();
  const cpf = document.getElementById("mCpf").value.trim();
  const tel = document.getElementById("mTel").value.trim();
  const email = document.getElementById("mEmail").value.trim();
  if (!nome || !cpf) { alert("Nome e CPF são obrigatórios."); return; }

  const patients = getPatients();
  const editId = document.getElementById("modal").dataset.editId;
  if (editId) {
    const p = patients.find(x => x.id === Number(editId));
    p.nome = nome; p.cpf = cpf; p.tel = tel; p.email = email;
  } else {
    const id = patients.length ? (Math.max(...patients.map(p=>p.id)) + 1) : 1;
    patients.push({ id, nome, cpf, tel, email });
  }
  savePatients(patients);
  renderPatientsTable();
  closeModal();
}

function editPatient(id){
  openModal(id);
}

function deletePatient(id){
  if (!confirm("Excluir paciente?")) return;
  const list = getPatients().filter(p=>p.id!==id);
  savePatients(list);
  renderPatientsTable();
}
