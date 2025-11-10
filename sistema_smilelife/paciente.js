/* patient.js - logic for pacientes.html */

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("pacientes.html")) return;
  loadPatientView();
});

function loadPatientView(){
  const session = JSON.parse(localStorage.getItem("smile_session") || sessionStorage.getItem("smile_session") || "null");
  if (!session) { window.location.href = "index.html"; return; }

  document.getElementById("pNome").textContent = session.name || "—";
  document.getElementById("pCpf").textContent = "CPF: " + (session.cpf || "—");
  document.getElementById("pEmail").textContent = "E-mail: " + (session.email || "—");

  // demo consultas
  const demo = [
    { data: "12/11/2025", hora: "14:00", dentista: "Dr. Bruno", status: "Agendado" },
    { data: "25/11/2025", hora: "09:30", dentista: "Dra. Ana", status: "Agendado" }
  ];
  const tbody = document.getElementById("consultasPaciente");
  demo.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.data}</td><td>${d.hora}</td><td>${d.dentista}</td><td>${d.status}</td>`;
    tbody.appendChild(tr);
  });

  // prontuario demo
  const hist = document.getElementById("prontHistorico");
  const events = [
    { title: "10/09/2025 - Consulta inicial", notes: "Diagnóstico: cárie; Tratamento: obturação" },
    { title: "12/10/2025 - Limpeza", notes: "Profilaxia realizada" }
  ];
  events.forEach(e => {
    const div = document.createElement("div");
    div.className = "event";
    div.innerHTML = `<strong>${e.title}</strong><div class="small muted">${e.notes}</div>`;
    hist.appendChild(div);
  });

  document.getElementById("editProfile")?.addEventListener("click", () => alert("Abra formulário para editar perfil (poderia ser modal)."));

}
// Preencher informações do paciente salvas no localStorage

document.getElementById("pacNome").textContent = localStorage.getItem("nome") || "—";
document.getElementById("pacCPF").textContent = localStorage.getItem("cpf") || "—";
document.getElementById("pacEmail").textContent = localStorage.getItem("email") || "—";

document.getElementById("pacienteNome").textContent = localStorage.getItem("nome") || "Meu Perfil";

// Listar consultas
const consultas = [
    { data: "12/11/2025", hora: "14:00", dent: "Dr. Bruno", status: "Confirmada" },
    { data: "25/11/2025", hora: "09:30", dent: "Dra. Ana", status: "Pendente" }
];

const tabela = document.getElementById("consultasPaciente");
consultas.forEach(c => {
    tabela.innerHTML += `
        <tr>
            <td>${c.data}</td>
            <td>${c.hora}</td>
            <td>${c.dent}</td>
            <td>${c.status}</td>
        </tr>
    `;
});

