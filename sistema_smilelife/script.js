/* script.js - Session / Login / Routing utilities */

// demo users
const USERS = [
  { type: "dentista", email: "dentista@smile.com", cpf: "111.111.111-11", pass: "123", name: "Dr. Ana Souza" },
  { type: "paciente",  email: "paciente@smile.com", cpf: "222.222.222-22", pass: "123", name: "João Silva" }
];

// on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Login page handlers
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      doLogin();
    });

    document.getElementById("togglePwd")?.addEventListener("click", () => {
      const p = document.getElementById("loginPass");
      p.type = p.type === "password" ? "text" : "password";
    });

    document.getElementById("demoDentista")?.addEventListener("click", () => demoLogin("dentista"));
    document.getElementById("demoPaciente")?.addEventListener("click", () => demoLogin("paciente"));
  }

  // private pages
  initPrivate();
});

function demoLogin(type){
  const user = USERS.find(u => u.type === type);
  if (!user) return;
  document.getElementById("loginUser").value = user.email;
  document.getElementById("loginPass").value = user.pass;
  doLogin();
}

function doLogin(){
  const userIn = (document.getElementById("loginUser").value || "").trim();
  const passIn = (document.getElementById("loginPass").value || "").trim();
  const remember = document.getElementById("remember")?.checked;
  const err = document.getElementById("loginError");
  if (err) err.textContent = "";

  if (!userIn || !passIn) {
    if (err) err.textContent = "Preencha e-mail/CPF e senha.";
    return;
  }

  const found = USERS.find(u => (u.email.toLowerCase() === userIn.toLowerCase() || u.cpf === userIn) && u.pass === passIn);
  if (!found) {
    if (err) err.textContent = "Credenciais inválidas.";
    return;
  }

  const session = { type: found.type, name: found.name, email: found.email, cpf: found.cpf, ts: Date.now() };
  if (remember) localStorage.setItem("smile_session", JSON.stringify(session));
  else sessionStorage.setItem("smile_session", JSON.stringify(session));

  // redirect
  if (found.type === "dentista") window.location.href = "dentistas.html";
  else window.location.href = "pacientes.html";
}

function initPrivate(){
  const path = window.location.pathname;
  const session = JSON.parse(localStorage.getItem("smile_session") || sessionStorage.getItem("smile_session") || "null");

  // If no session, only allow index.html
  if (!session) {
    if (path.endsWith("index.html") || path === "/" || path === "") return;
    window.location.href = "index.html";
    return;
  }

  // set default name in header if present
  const isDent = path.includes("dentistas.html");
  const isPac  = path.includes("pacientes.html");

  if (isDent) {
    document.getElementById("dentName") && (document.getElementById("dentName").textContent = session.name);
    document.getElementById("logoutDent")?.addEventListener("click", doLogout);
  }
  if (isPac) {
    document.getElementById("pacName") && (document.getElementById("pacName").textContent = session.name);
    document.getElementById("logoutPac")?.addEventListener("click", doLogout);
  }
}

function doLogout(){
  localStorage.removeItem("smile_session");
  sessionStorage.removeItem("smile_session");
  window.location.href = "index.html";
}

function criarConta() {
    let nome = document.getElementById("regNome").value.trim();
    let user = document.getElementById("regUser").value.trim();
    let senha = document.getElementById("regSenha").value.trim();
    let tipo = document.getElementById("tipoUsuario").value;
    let erro = document.getElementById("regErro");

    if (!nome || !user || !senha) {
        erro.textContent = "Preencha todos os campos.";
        return;
    }

    // Salvar conta criada
    const novaConta = {
        nome: nome,
        user: user,
        senha: senha,
        tipo: tipo
    };

    localStorage.setItem("novaConta", JSON.stringify(novaConta));

    alert("Conta criada com sucesso! Faça login agora.");
    window.location.href = "index.html";
}

// Mostrar nome no topo
document.getElementById("dashNome").textContent = localStorage.getItem("nome");

// Alternar telas
document.querySelectorAll(".menu-item").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".menu-item.active").classList.remove("active");
        btn.classList.add("active");

        document.querySelector(".screen.active").classList.remove("active");
        document.getElementById(btn.dataset.screen).classList.add("active");
    });
});

// Mock de consultas
let consultas = [
    { data: "12/11/2025", hora: "14:00", dentista: "Dr. Bruno", status: "Confirmada" }
];

function atualizarConsultas() {
    const tbody = document.getElementById("listaConsultas");
    tbody.innerHTML = "";

    consultas.forEach((c, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${c.data}</td>
                <td>${c.hora}</td>
                <td>${c.dentista}</td>
                <td>${c.status}</td>
                <td>
                    <button onclick="cancelar(${i})">Cancelar</button>
                    <button onclick="remarcar(${i})">Remarcar</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("proxConsulta").textContent =
        consultas.length ? `${consultas[0].data} às ${consultas[0].hora}` : "Nenhuma consulta marcada.";
}

atualizarConsultas();

// Cancelar consulta
function cancelar(i) {
    if (confirm("Deseja cancelar esta consulta?")) {
        consultas.splice(i, 1);
        atualizarConsultas();
    }
}

// Remarcar
function remarcar(i) {
    alert("Função remarcar em desenvolvimento.");
}

// Agendar consulta
function confirmarAgendamento() {
    let dentista = document.getElementById("agendarDentista").value;
    let data = document.getElementById("agendarData").value;
    let hora = document.getElementById("agendarHorario").value;

    if (!dentista || !data) {
        alert("Preencha todos os campos!");
        return;
    }

    consultas.push({
        data: data,
        hora: hora,
        dentista: dentista,
        status: "Pendente"
    });

    atualizarConsultas();

    document.getElementById("agendarStatus").textContent =
        "✅ Consulta agendada com sucesso!";
}

