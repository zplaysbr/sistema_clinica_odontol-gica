// script.js — SmileLife protótipo funcional (LocalStorage) + correções de prontuário e abas

// ------------------------------
// Utilidades de armazenamento
// ------------------------------
const DB = {
  load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  save(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};

const state = {
  pacientes: DB.load('pacientes', [
    { id: 456, nome: 'Laura Gonçalves', cpf: '000.000.000-00', dataNascimento: '1990-08-25', telefone: '(11) 98765-4321', email: 'laura@email.com', convenio: '' }
  ]),
  dentistas: DB.load('dentistas', [
    { id: 'dr_joao', nome: 'Dr. João Silva', cro: 'SP 12345', especialidade: 'Clínico Geral', status: 'Ativo' },
    { id: 'dra_maria', nome: 'Dra. Maria Alves', cro: 'SP 67890', especialidade: 'Ortodontista', status: 'Ativo' },
    { id: 'dr_carlos', nome: 'Dr. Carlos Lima', cro: 'SP 11223', especialidade: 'Endodontista', status: 'Férias' },
  ]),
  consultas: DB.load('consultas', [
    { id: 1, hora: '10:00', dataISO: new Date().toISOString().slice(0,10), paciente: 'Ana Silva', dentista: 'Dr. João', status: 'Confirmada' },
    { id: 2, hora: '14:30', dataISO: new Date().toISOString().slice(0,10), paciente: 'Bruno Costa', dentista: 'Dra. Maria', status: 'Aguardando' },
  ]),
  evolucoes: DB.load('evolucoes', [
    { data: '2025-11-10', descricao: 'Extração Dente Siso 38 (Procedimento Cirúrgico). Dentista: Dr. Pedro.', nota: 'Sem intercorrências. Prescrição de antibiótico e retorno para remoção de sutura.' },
    { data: '2025-09-01', descricao: 'Restauração no Dente 16. Dentista: Dra. Ana.', nota: 'Cárie removida e obturação com resina composta A3.' },
  ]),
  anamnese: DB.load('anamnese', [
    { pacienteId: 456, notas: 'Alergias: Penicilina. Hipertensão controlada.', data: '2025-11-12' }
  ]),
  exames: DB.load('exames', [
    { pacienteId: 456, nome: 'Radiografia-Periapical-16.jpg', data: '12/09/2025' },
    { pacienteId: 456, nome: 'Laudo-Biopsia-01.pdf', data: '20/10/2025' }
  ]),
  estoque: DB.load('estoque', [
    { item: 'Luvas Descartáveis (Caixa)', qtd: 5, minimo: 3 },
    { item: 'Resina Composta A3', qtd: 2, minimo: 4 },
    { item: 'Agulhas Anestésicas', qtd: 20, minimo: 10 },
  ]),
  transacoes: DB.load('transacoes', [
    { data: '26/11', descricao: 'Pagamento Tratamento (João S.)', tipo: 'Receita', valor: 500.00, status: 'Pago' },
    { data: '25/11', descricao: 'Compra de Luvas Descartáveis', tipo: 'Despesa', valor: 150.00, status: 'Pago' },
    { data: '30/11', descricao: 'Parcela Tratamento (Maria A.)', tipo: 'Receita', valor: 300.00, status: 'Pendente' },
  ]),
  usuarios: DB.load('usuarios', [
    { username: 'admin.geral', perfil: 'Administrador' },
    { username: 'secretaria.ana', perfil: 'Secretária' },
    { username: 'dentista.joao', perfil: 'Dentista' },
  ]),
  notificacoesPendentes: DB.load('notificacoesPendentes', 5),
  temaEscuro: DB.load('temaEscuro', false),
};

function persist() {
  DB.save('pacientes', state.pacientes);
  DB.save('dentistas', state.dentistas);
  DB.save('consultas', state.consultas);
  DB.save('evolucoes', state.evolucoes);
  DB.save('anamnese', state.anamnese);
  DB.save('exames', state.exames);
  DB.save('estoque', state.estoque);
  DB.save('transacoes', state.transacoes);
  DB.save('usuarios', state.usuarios);
  DB.save('notificacoesPendentes', state.notificacoesPendentes);
  DB.save('temaEscuro', state.temaEscuro);
}

// ------------------------------
// Navegação principal
// ------------------------------
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');

navItems.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    navItems.forEach(i => i.classList.remove('active'));
    a.classList.add('active');
    const target = a.dataset.content;
    sections.forEach(s => s.classList.toggle('active', s.id === target));
    pageTitle.textContent = a.textContent.trim();
  });
});

// ------------------------------
// Modo Escuro (Usabilidade RNF)
// ------------------------------
const themeToggleBtn = document.getElementById('theme-toggle');
if (state.temaEscuro) document.body.classList.add('dark-mode');
updateThemeToggleLabel();

themeToggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  state.temaEscuro = document.body.classList.contains('dark-mode');
  updateThemeToggleLabel();
  persist();
});

function updateThemeToggleLabel() {
  if (!themeToggleBtn) return;
  themeToggleBtn.innerHTML = state.temaEscuro
    ? '<i class="fas fa-sun"></i> Desativar Modo Escuro'
    : '<i class="fas fa-moon"></i> Ativar Modo Escuro';
}

// ------------------------------
// RN002: Lembretes 24h
// ------------------------------
const lembretesCard = document.querySelector('#dashboard .card.full-width.mt-20:last-of-type p');
function renderLembretes() {
  lembretesCard && (lembretesCard.textContent = `${state.notificacoesPendentes} lembretes automáticos de consulta a serem enviados. (RN002)`);
}
renderLembretes();
setInterval(() => {
  if (state.notificacoesPendentes > 0) {
    state.notificacoesPendentes = Math.max(0, state.notificacoesPendentes - 1);
    persist();
    renderLembretes();
  }
}, 3600 * 1000);

// ------------------------------
// Alternância entre abas em Pacientes (main-tabs da seção #pacientes)
// ------------------------------
document.querySelectorAll('#pacientes .main-tabs .tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;
    // Alterna estado dos botões
    button.parentElement.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    // Alterna conteúdos
    document.querySelectorAll('#pacientes .main-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(targetId)?.classList.add('active');
  });
});

// ------------------------------
// Alternância das subtabs do histórico clínico dentro do prontuário
// ------------------------------
document.querySelectorAll('#prontuario-view .historico-tabs .tabs-nav .tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabsNav = btn.parentElement;
    const container = tabsNav.parentElement; // historico-tabs
    const targetId = btn.dataset.tab;
    tabsNav.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    container.querySelector(`#${targetId}`)?.classList.add('active');
  });
});

// ------------------------------
// RN003: Cadastro de Paciente (campos obrigatórios)
// ------------------------------
const cadastroPacienteForm = document.getElementById('cadastro-paciente-form');
cadastroPacienteForm?.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome_completo').value.trim();
  const dataNasc = document.getElementById('data_nascimento').value;
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email_paciente').value.trim();
  const convenio = document.getElementById('convenio').value;
  if (!nome || !dataNasc || !telefone) {
    alert('RN003: Nome, Data de Nasc. e Telefone são obrigatórios.');
    return;
  }
  const novoId = Math.floor(Math.random() * 100000);
  state.pacientes.push({ id: novoId, nome, cpf: '', dataNascimento: dataNasc, telefone, email, convenio });
  persist();
  alert(`Paciente cadastrado com sucesso! ID: ${novoId}. Prontuário aberto.`);
  cadastroPacienteForm.reset();
  // Ao cadastrar, alterna para a aba de prontuário
  document.querySelector('#pacientes .main-tabs .tab-button[data-tab="prontuario-view"]')?.click();
});

// ------------------------------
// Buscar/Listar/Editar paciente na aba Prontuário
// ------------------------------
const prontuarioSearchCard = document.querySelector('#prontuario-view .card-animated.full-width'); // 1º card
const buscarInput = prontuarioSearchCard?.querySelector('input[type="text"]');
const buscarBtn = prontuarioSearchCard?.querySelector('.btn-primary');
const listarBtn = prontuarioSearchCard?.querySelector('.btn-secondary');

const pacienteHeaderCard = document.querySelector('#prontuario-view .card-animated.full-width:nth-of-type(2)');
const pacienteHeader = pacienteHeaderCard?.querySelector('h3');
const pacienteInfo = pacienteHeaderCard?.querySelector('p');
const editarBtn = pacienteHeaderCard?.querySelector('.btn-secondary');

function setPacienteAtual(p) {
  if (!pacienteHeader) return;
  pacienteHeader.innerHTML = `Paciente Atual: <strong>${p.nome}</strong> (ID: ${p.id})`;
  const nascBR = p.dataNascimento ? p.dataNascimento.split('-').reverse().join('/') : '—';
  pacienteInfo && (pacienteInfo.textContent = `Data de Nasc.: ${nascBR} | Telefone: ${p.telefone || '—'} | Email: ${p.email || '—'}`);
}

buscarBtn?.addEventListener('click', () => {
  const termo = (buscarInput?.value || '').trim().toLowerCase();
  if (!termo) { alert('Digite nome, CPF ou ID.'); return; }
  const pac = state.pacientes.find(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.cpf.replace(/\D/g,'').includes(termo.replace(/\D/g,'')) ||
    String(p.id) === termo
  );
  if (pac) {
    setPacienteAtual(pac);
    alert(`Paciente encontrado: ${pac.nome} (ID: ${pac.id})`);
  } else {
    alert('Paciente não encontrado.');
  }
});

listarBtn?.addEventListener('click', () => {
  const lista = state.pacientes.map(p => `${p.id} - ${p.nome}`).join('\n');
  alert(lista ? `Pacientes:\n${lista}` : 'Nenhum paciente cadastrado.');
});

editarBtn?.addEventListener('click', () => {
  const match = pacienteHeader?.textContent?.match(/\(ID:\s*(\d+)\)/);
  const idAtual = match ? parseInt(match[1], 10) : state.pacientes[0]?.id;
  const pac = state.pacientes.find(p => p.id === idAtual);
  if (!pac) { alert('Nenhum paciente selecionado.'); return; }
  const novoTel = prompt('Novo telefone:', pac.telefone || '');
  const novoEmail = prompt('Novo e-mail:', pac.email || '');
  if (novoTel) pac.telefone = novoTel;
  if (novoEmail) pac.email = novoEmail;
  persist();
  setPacienteAtual(pac);
  alert('Dados atualizados!');
});

// ------------------------------
// Odontograma interativo (seleção + item no plano de tratamento)
// ------------------------------
const selectedToothDisplay = document.getElementById('selected-tooth-display');
const treatmentPlanList = document.querySelector('#prontuario-view .treatment-plan-list');
document.querySelectorAll('#prontuario-view .tooth-example').forEach(el => {
  el.addEventListener('click', () => {
    const tooth = el.dataset.tooth;
    if (selectedToothDisplay) selectedToothDisplay.textContent = tooth;
    if (treatmentPlanList) {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-clock pending"></i> Procedimento pendente no dente ${tooth}`;
      treatmentPlanList.appendChild(li);
    }
  });
});

// ------------------------------
// Anamnese: salvar notas
// ------------------------------
const anamneseForm = document.querySelector('#anamnese form');
anamneseForm?.addEventListener('submit', e => {
  e.preventDefault();
  const notas = document.getElementById('anamnese-notas').value.trim();
  if (!notas) { alert('Digite as notas da anamnese.'); return; }
  const match = pacienteHeader?.textContent?.match(/\(ID:\s*(\d+)\)/);
  const pacienteId = match ? parseInt(match[1], 10) : state.pacientes[0]?.id;
  if (!pacienteId) { alert('Selecione um paciente primeiro.'); return; }
  state.anamnese.unshift({ pacienteId, notas, data: new Date().toISOString().slice(0,10) });
  persist();
  alert('Anamnese salva!');
  anamneseForm.reset();
});

// ------------------------------
// RF006: Evolução clínica (render e registro)
// ------------------------------
const registroEvolucaoForm = document.getElementById('registro-evolucao-form');
const listaEvolucaoExistente = document.getElementById('lista-evolucao-existente');

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function renderEvolucoes() {
  if (!listaEvolucaoExistente) return;
  listaEvolucaoExistente.innerHTML = state.evolucoes.map(ev => `
    <div class="evolucao-item">
      <p><strong>${formatDate(ev.data)}:</strong> ${ev.descricao}</p>
      <p class="evolucao-nota">${ev.nota}</p>
    </div>
  `).join('');
}
renderEvolucoes();

registroEvolucaoForm?.addEventListener('submit', e => {
  e.preventDefault();
  const data = document.getElementById('data_evolucao').value;
  const dentista = document.getElementById('dentista_evolucao').value;
  const procDente = document.getElementById('procedimento_evolucao').value.trim();
  const nota = document.getElementById('nota_evolucao').value.trim();
  if (!data || !dentista || !procDente || !nota) {
    alert('Preencha todos os campos de evolução clínica.');
    return;
  }
  state.evolucoes.unshift({ data, descricao: `${procDente}. Dentista: ${dentista}.`, nota });
  persist();
  renderEvolucoes();
  registroEvolucaoForm.reset();
  alert('Evolução clínica registrada.');
});

// ------------------------------
// Exames / Radiografias: upload simulado
// ------------------------------
const examesUploadBtn = document.querySelector('#exames .btn-secondary');
const examesContainer = document.getElementById('exames');
examesUploadBtn?.addEventListener('click', () => {
  const nomeArquivo = prompt('Digite o nome do exame (ex: Radiografia-01.jpg):');
  if (!nomeArquivo) return;
  const match = pacienteHeader?.textContent?.match(/\(ID:\s*(\d+)\)/);
  const pacienteId = match ? parseInt(match[1], 10) : state.pacientes[0]?.id;
  state.exames.unshift({ pacienteId, nome: nomeArquivo, data: new Date().toLocaleDateString('pt-BR') });
  persist();
  const p = document.createElement('p');
  p.className = 'placeholder-text';
  p.style.position = 'static';
  p.style.transform = 'none';
  p.style.textAlign = 'left';
  p.style.marginTop = '10px';
  p.innerHTML = `Arquivo: ${nomeArquivo} (${new Date().toLocaleDateString('pt-BR')}) - <a href="#">Visualizar</a>`;
  examesContainer?.appendChild(p);
  alert('Exame registrado.');
});

// ------------------------------
// RF001/RN001: Agendamento e conflitos
// ------------------------------
const agendamentoForm = document.getElementById('agendamento-form');
const agendamentosTabelaBody = document.getElementById('agendamentos-hoje');

function renderAgendamentosHoje() {
  if (!agendamentosTabelaBody) return;
  const hoje = new Date().toISOString().slice(0,10);
  const rows = state.consultas
    .filter(c => c.dataISO === hoje)
    .map(c => `
      <tr data-id="${c.id}">
        <td>${c.hora}</td>
        <td>${c.paciente}</td>
        <td>${c.dentista}</td>
        <td class="${c.status === 'Confirmada' ? 'pago' : (c.status === 'Aguardando' ? 'pendente' : '')}">${c.status}</td>
        <td>
          <button class="btn-secondary small-btn action-reagendar" data-id="${c.id}">Reagendar</button>
          <button class="btn-danger small-btn action-cancelar" data-id="${c.id}">Cancelar</button>
        </td>
      </tr>
    `).join('');
  agendamentosTabelaBody.innerHTML = rows || '<tr><td colspan="5">Sem consultas hoje.</td></tr>';
}
renderAgendamentosHoje();

agendamentoForm?.addEventListener('submit', e => {
  e.preventDefault();
  const paciente = document.getElementById('paciente').value.trim();
  const dentistaSel = document.getElementById('dentista').value;
  const horaInput = document.getElementById('hora').value;
  if (!paciente || !dentistaSel || !horaInput) {
    alert('Preencha paciente, dentista e data/hora.');
    return;
  }
  const dentistaNome = dentistaSel === 'dr_joao' ? 'Dr. João' : 'Dra. Maria';
  const dt = new Date(horaInput);
  const dataISO = dt.toISOString().slice(0,10);
  const hora = dt.toTimeString().slice(0,5);
  const conflito = state.consultas.some(c => c.dataISO === dataISO && c.hora === hora && c.dentista === dentistaNome && c.status !== 'Cancelada');
  if (conflito) {
    alert('RN001: Horário já ocupado para este dentista. Escolha outro horário.');
    return;
  }
  const novo = { id: Math.floor(Math.random()*100000), hora, dataISO, paciente, dentista: dentistaNome, status: 'Aguardando' };
  state.consultas.push(novo);
  persist();
  renderAgendamentosHoje();
  alert('Consulta agendada com sucesso!');
  agendamentoForm.reset();
});

document.addEventListener('click', e => {
  const id = e.target?.dataset?.id;
  if (!id) return;

  if (e.target.classList.contains('action-cancelar')) {
    const c = state.consultas.find(x => String(x.id) === String(id));
    if (c) {
      c.status = 'Cancelada';
      persist();
      renderAgendamentosHoje();
      alert('Consulta cancelada.');
    }
  }
  if (e.target.classList.contains('action-reagendar')) {
    const c = state.consultas.find(x => String(x.id) === String(id));
    if (!c) return;
    const novaHora = prompt('Informe nova data/hora (YYYY-MM-DD HH:MM):', `${c.dataISO} ${c.hora}`);
    if (!novaHora) return;
    const [dataStr, horaStr] = novaHora.split(' ');
    const conflito = state.consultas.some(x => x.dataISO === dataStr && x.hora === horaStr && x.dentista === c.dentista && x.status !== 'Cancelada' && x.id !== c.id);
    if (conflito) {
      alert('RN001: Novo horário conflita com outro agendamento para este dentista.');
      return;
    }
    c.dataISO = dataStr;
    c.hora = horaStr;
    c.status = 'Confirmada';
    persist();
    renderAgendamentosHoje();
    alert('Consulta reagendada e confirmada.');
  }
});

// ------------------------------
// RN007: Estoque mínimo e ajuste
// ------------------------------
const listaEstoqueBody = document.getElementById('lista-estoque');
const lowStockAlert = document.getElementById('low-stock-alert');
const lowStockMessage = document.getElementById('low-stock-message');
const ajusteEstoqueForm = document.getElementById('ajuste-estoque-form');

function renderEstoque() {
  if (!listaEstoqueBody) return;
  listaEstoqueBody.innerHTML = state.estoque.map(it => {
    const statusClass = it.qtd <= it.minimo ? 'despesa' : 'pago';
    const statusText = it.qtd <= it.minimo ? 'Abaixo do mínimo' : 'OK';
    return `
      <tr>
        <td>${it.item}</td>
        <td>${it.qtd}</td>
        <td>${it.minimo}</td>
        <td class="${statusClass}">${statusText}</td>
      </tr>
    `;
  }).join('');

  const faltantes = state.estoque.filter(it => it.qtd <= it.minimo);
  lowStockAlert.style.display = 'block';
  if (faltantes.length > 0) {
    lowStockAlert.classList.remove('success-card');
    lowStockAlert.classList.add('warning-card');
    lowStockMessage.textContent = `Itens abaixo do mínimo: ${faltantes.map(f => f.item).join(', ')}. (RN007)`;
  } else {
    lowStockAlert.classList.remove('warning-card');
    lowStockAlert.classList.add('success-card');
    lowStockMessage.textContent = 'Todos os itens acima do mínimo. (RN007)';
  }
}
renderEstoque();

ajusteEstoqueForm?.addEventListener('submit', e => {
  e.preventDefault();
  const item = document.getElementById('item_estoque').value.trim();
  const qtd = parseInt(document.getElementById('quantidade_estoque').value, 10);
  const tipo = document.getElementById('tipo_ajuste').value;
  if (!item || !qtd || qtd <= 0 || !tipo) {
    alert('Preencha item, quantidade (>0) e tipo de ajuste.');
    return;
  }
  let registro = state.estoque.find(x => x.item.toLowerCase() === item.toLowerCase());
  if (!registro) {
    registro = { item, qtd: 0, minimo: 5 };
    state.estoque.push(registro);
  }
  if (tipo === 'entrada') registro.qtd += qtd;
  else registro.qtd = Math.max(0, registro.qtd - qtd);

  persist();
  renderEstoque();
  ajusteEstoqueForm.reset();
  alert('Ajuste de estoque registrado.');
});

// ------------------------------
// RN004: Cadastro de dentistas
// ------------------------------
const cadastroDentistaForm = document.getElementById('cadastro-dentista-form');
cadastroDentistaForm?.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome_dentista').value.trim();
  const cro = document.getElementById('cro').value.trim();
  const esp = document.getElementById('especialidade').value;
  if (!nome || !cro || !esp) {
    alert('Informe nome, CRO e especialidade.');
    return;
  }
  state.dentistas.push({ id: nome.toLowerCase().replace(/\s+/g,'_'), nome, cro, especialidade: mapEsp(esp), status: 'Ativo' });
  persist();
  alert('Dentista cadastrado.');
  cadastroDentistaForm.reset();
});
function mapEsp(val) {
  return val === 'clinico' ? 'Clínico Geral' : val === 'orto' ? 'Ortodontista' : 'Endodontista';
}

// ------------------------------
// Usuários e permissões (mock)
// ------------------------------
const cadastroUsuarioForm = document.getElementById('cadastro-usuario-form');
cadastroUsuarioForm?.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('novo_usuario').value.trim();
  const senha = document.getElementById('senha_usuario').value.trim();
  const perfil = document.getElementById('perfil_acesso').value;
  if (!username || !senha || !perfil) {
    alert('Informe usuário, senha e perfil.');
    return;
  }
  state.usuarios.push({ username, perfil: perfil === 'admin' ? 'Administrador' : perfil === 'secretaria' ? 'Secretária' : 'Dentista' });
  persist();
  alert('Usuário criado (mock).');
  cadastroUsuarioForm.reset();
});

// ------------------------------
// Sessão inativa (RNF Segurança)
// ------------------------------
let lastInteraction = Date.now();
['click','keydown','mousemove','scroll'].forEach(evt => {
  document.addEventListener(evt, () => { lastInteraction = Date.now(); });
});
setInterval(() => {
  const INATIVO_MS = 15 * 60 * 1000; // 15 min
  if (Date.now() - lastInteraction > INATIVO_MS) {
    alert('Sessão inativa. Por segurança, recarregaremos a aplicação.');
    location.reload();
  }
}, 60 * 1000);

// ------------------------------
// Banner LGPD (mínimo)
// ------------------------------
(function lgpdBanner(){
  if (localStorage.getItem('lgpdOk')) return;
  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.bottom = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.background = '#0d6efd';
  banner.style.color = '#fff';
  banner.style.padding = '10px 16px';
  banner.style.zIndex = '9999';
  banner.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
      <span>Usamos dados de pacientes e usuários para gestão clínica. Ao continuar, você confirma que leu e aceita nossa política de privacidade (LGPD).</span>
      <button id="lgpd-aceitar" style="background:#fff; color:#0d6efd; border:none; border-radius:6px; padding:8px 12px; font-weight:600;">OK, entendi</button>
    </div>
  `;
  document.body.appendChild(banner);
  document.getElementById('lgpd-aceitar').addEventListener('click', () => {
    localStorage.setItem('lgpdOk', '1');
    banner.remove();
  });
})();
// Alternância entre abas principais do prontuário (dentro de #pacientes)
document.querySelectorAll('#pacientes .main-tabs .tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;

    // Alterna estado dos botões
    button.parentElement.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    // Alterna conteúdos
    document.querySelectorAll('#pacientes .main-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(targetId)?.classList.add('active');

    // Salva aba ativa no localStorage
    localStorage.setItem('abaProntuarioAtiva', targetId);
  });
});

// Ao carregar a página, restaura a aba ativa
window.addEventListener('DOMContentLoaded', () => {
  const abaSalva = localStorage.getItem('abaProntuarioAtiva');
  if (abaSalva) {
    // Remove active de todas
    document.querySelectorAll('#pacientes .main-tabs .tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#pacientes .main-tab-content').forEach(c => c.classList.remove('active'));

    // Ativa a aba salva
    document.querySelector(`#pacientes .main-tabs .tab-button[data-tab="${abaSalva}"]`)?.classList.add('active');
    document.getElementById(abaSalva)?.classList.add('active');
  }
});

