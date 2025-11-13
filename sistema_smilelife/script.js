document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const transacoesRecentes = document.getElementById('transacoes-recentes'); 

    // Mapeamento de títulos para o header
    const titlesMap = {
        'dashboard': 'Dashboard Inicial',
        'agendamento': 'Agendamento de Consultas',
        'pacientes': 'Gerenciamento de Pacientes',
        'orcamento': 'Emissão de Orçamentos', 
        'dentistas': 'Gerenciamento de Dentistas', 
        'relatorios': 'Relatórios Gerenciais', 
        'financeiro': 'Gestão Financeira',
        'estoque': 'Controle de Estoque', 
        'config': 'Configurações do Sistema'
    };
    
    // --- DADOS GLOBAIS: ESTOQUE (RN007) ---
    let estoque = [
        { item: 'Luvas Descartáveis (Caixa)', quantidade: 45, minimo: 50 },
        { item: 'Resina Composta A3', quantidade: 12, minimo: 8 },
        { item: 'Agulhas Anestésicas', quantidade: 150, minimo: 100 }
    ];
    // ----------------------------------------
    
    // --- FUNÇÕES RN007: CONTROLE DE PONTO DE PEDIDO ---
    const lowStockAlertDiv = document.getElementById('low-stock-alert');
    const lowStockMessageP = document.getElementById('low-stock-message');
    const listaEstoqueBody = document.getElementById('lista-estoque');
    
    /**
     * RN007: Verifica o array de estoque e atualiza o alerta na Dashboard.
     */
    function checkLowStockAlerts() {
        const lowStockItems = estoque.filter(item => item.quantidade < item.minimo);
        
        if (lowStockAlertDiv) {
             if (lowStockItems.length > 0) {
                const itemNames = lowStockItems.map(item => item.item).join(', ');
                lowStockAlertDiv.style.display = 'block'; 
                lowStockMessageP.innerHTML = `**${lowStockItems.length}** item(s) abaixo do estoque mínimo: **${itemNames}**. Necessário realizar pedido.`;
                lowStockAlertDiv.classList.remove('success-card');
                lowStockAlertDiv.classList.add('warning-card');
            } else {
                lowStockAlertDiv.style.display = 'block'; 
                lowStockMessageP.textContent = 'Todos os itens estão acima do ponto de pedido mínimo. Estoque OK.';
                lowStockAlertDiv.classList.remove('warning-card');
                lowStockAlertDiv.classList.add('success-card');
            }
        }
    }

    /**
     * Renderiza a tabela de estoque com base no array atualizado.
     */
    function renderStockTable() {
        if (!listaEstoqueBody) return;
        listaEstoqueBody.innerHTML = ''; 

        estoque.forEach(item => {
            let statusClass = 'pago'; 
            let statusText = 'OK';
            
            if (item.quantidade < item.minimo) {
                statusClass = 'pendente'; 
                statusText = 'Baixo';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.item}</td>
                <td>${item.quantidade}</td>
                <td>${item.minimo}</td>
                <td class="${statusClass}">${statusText}</td>
            `;
            listaEstoqueBody.appendChild(row);
        });
    }

    // Inicialização da renderização e verificação de estoque
    renderStockTable();
    checkLowStockAlerts();
    // -------------------------------------------------------------

    // --- LÓGICA RNF: TROCA DE TEMA (DIA/NOITE) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Função para aplicar o tema salvo
    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (themeToggle) {
             if (savedTheme === 'dark') {
                body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Desativar Modo Escuro';
            } else {
                // Tema claro é o padrão, mas garante que o localStorage seja tratado.
                body.classList.remove('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Ativar Modo Escuro';
            }
        }
    }

    // Aplica o tema ao carregar a página
    applySavedTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Desativar Modo Escuro';
                alert('Modo Escuro Ativado (RNF: Usabilidade)');
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Ativar Modo Escuro';
                alert('Modo Claro Ativado (RNF: Usabilidade)');
            }
        });
    }
    // ----------------------------------------------
    
    // --- LÓGICA FINAL: ODONTOGRAMA INTERATIVO (RF002/RF006) ---
    const toothExamples = document.querySelectorAll('.tooth-example');
    const selectedToothDisplay = document.getElementById('selected-tooth-display');
    const procedimentoEvolucaoInput = document.getElementById('procedimento_evolucao');

    toothExamples.forEach(tooth => {
        tooth.addEventListener('click', () => {
            const toothId = tooth.getAttribute('data-tooth');
            const toothTitle = tooth.getAttribute('title');

            // 1. Remove a seleção de todos os dentes
            toothExamples.forEach(t => t.classList.remove('selected'));
            
            // 2. Adiciona a seleção ao dente clicado
            tooth.classList.add('selected');

            // 3. Atualiza o status na tela
            selectedToothDisplay.textContent = `${toothId} (${toothTitle})`;
            selectedToothDisplay.style.color = 'var(--color-primary)';
            
            // 4. Preenche o campo de Evolução Clínica com o dente selecionado
            if (procedimentoEvolucaoInput) {
                procedimentoEvolucaoInput.value = `Planejamento para Dente ${toothId}:`;
                // Muda para a aba de Evolução Clinica
                document.querySelector('.historico-tabs .tab-button[data-tab="evolucao"]').click();
                
                alert(`Dente ${toothId} (Status: ${toothTitle}) SELECIONADO para procedimento. Verifique a aba 'Evolução Clínica' para registrar.`);
            }
        });
    });
    // -------------------------------------------------------------

    // --- Lógica de Navegação Principal (Sidebar) ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-content');
            const targetSection = document.getElementById(targetId);

            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            if (targetSection) {
                targetSection.classList.add('active');
                pageTitle.textContent = titlesMap[targetId] || 'Smilife';
            }
        });
    });
    
    // --- Lógica de Abas (Tabs) INTERNAS (Histórico) e PRINCIPAIS (Pacientes/Config) ---
    
    // 1. Abas do Histórico (Prontuário)
    const innerTabButtons = document.querySelectorAll('.historico-tabs .tabs-nav .tab-button');
    innerTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');
            const tabsContainer = button.closest('.historico-tabs');
            tabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetTabId).classList.add('active');
        });
    });
    
    // 2. Abas Principais (Gerenciamento de Pacientes e Configurações)
    const mainTabs = document.querySelectorAll('.main-tabs, .main-tabs-config');
    mainTabs.forEach(tabNav => {
        tabNav.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.getAttribute('data-tab');
                const section = button.closest('.content-section');
                
                // Remove a classe 'active' de todos os botões e conteúdos dentro da seção
                tabNav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                section.querySelectorAll('.main-tab-content').forEach(content => content.classList.remove('active'));
                
                // Adiciona a classe 'active' ao botão clicado e ao conteúdo correspondente
                button.classList.add('active');
                document.getElementById(targetTabId).classList.add('active');
            });
        });
    });
    
    // --- Simulação de Submissão do Formulário de Agendamento (RN001/RN002) ---
    const agendamentoForm = document.getElementById('agendamento-form');
    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const hora = document.getElementById('hora').value;
            const paciente = document.getElementById('paciente').value;
            if (hora.includes('2025-11-12T10:00')) {
                 alert('ERRO (RN001): Horário indisponível! O sistema deve impedir agendamentos em horários já ocupados.');
            } else {
                 alert(`Agendamento de ${paciente} realizado com sucesso! (RN002) O sistema enviará um lembrete automático em 24h.`);
            }
            agendamentoForm.reset();
        });
    }
    
    // --- LÓGICA DO REGISTRO DE EVOLUÇÃO CLÍNICA (RF006) ---
    const registroEvolucaoForm = document.getElementById('registro-evolucao-form');
    const listaEvolucaoExistente = document.getElementById('lista-evolucao-existente');

    if (registroEvolucaoForm) {
        registroEvolucaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dataInput = document.getElementById('data_evolucao').value;
            const dentista = document.getElementById('dentista_evolucao').value;
            const procedimento = document.getElementById('procedimento_evolucao').value;
            const nota = document.getElementById('nota_evolucao').value;

            const [year, month, day] = dataInput.split('-');
            const dataFormatada = `${day}/${month}/${year}`;

            const novoRegistro = document.createElement('div');
            novoRegistro.classList.add('evolucao-item', 'novo-registro'); 
            novoRegistro.innerHTML = `
                <p><strong>${dataFormatada}:</strong> ${procedimento}. Dentista: ${dentista}.</p>
                <p class="evolucao-nota">${nota}</p>
            `;
            
            if (listaEvolucaoExistente.children.length > 0) {
                listaEvolucaoExistente.insertBefore(novoRegistro, listaEvolucaoExistente.children[1]);
            } else {
                 listaEvolucaoExistente.appendChild(novoRegistro);
            }

            alert(`SUCESSO (RF006): Evolução Clínica de ${procedimento} para Laura Gonçalves registrada com sucesso!`);
            registroEvolucaoForm.reset();
            
            if (procedimentoEvolucaoInput) procedimentoEvolucaoInput.value = ''; // Limpa o campo após o registro
            if (selectedToothDisplay) {
                selectedToothDisplay.textContent = 'Nenhum';
                selectedToothDisplay.style.color = '';
            }
            toothExamples.forEach(t => t.classList.remove('selected'));
        });
    }

    // --- LÓGICA DE INTEGRAÇÃO DO ORÇAMENTO (RN005 -> RF003) ---
    const orcamentoForm = document.getElementById('orcamento-form');
    const totalOrcamentoDisplay = document.getElementById('total-orcamento');

    if (orcamentoForm) {
        orcamentoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const paciente = document.getElementById('paciente_orcamento').value;
            const valor1 = parseFloat(document.getElementById('procedimento_1').value) || 0;
            const valor2 = parseFloat(document.getElementById('procedimento_2').value) || 0;
            const total = valor1 + valor2;
            
            if (total > 0) {
                const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                totalOrcamentoDisplay.textContent = totalFormatado;

                if (confirm(`Orçamento gerado para ${paciente}: ${totalFormatado}. Deseja APROVAR o orçamento e registrá-lo como "Receita a Receber" no Fluxo de Caixa (RF003)?`)) {
                    
                    const hoje = new Date();
                    const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                    
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${dataFormatada}</td>
                        <td>Orç. Aprovado: ${paciente}</td>
                        <td class="receita">Receita</td>
                        <td class="receita">R$ ${total.toFixed(2).replace('.', ',')}</td>
                        <td class="pendente">A Receber</td>
                    `;

                    if (transacoesRecentes) {
                        transacoesRecentes.prepend(newRow);
                    }
                    
                    alert(`SUCESSO (RN005/RF003): Orçamento APROVADO! O valor de ${totalFormatado} foi registrado como "A Receber" no Fluxo de Caixa Financeiro.`);
                } else {
                    alert(`Orçamento gerado, mas não aprovado. Não houve registro automático no Financeiro.`);
                }
            } else {
                alert('Selecione pelo menos um procedimento para gerar o orçamento.');
            }
        });
    }
    
    // --- Lógica de AJUSTE DE ESTOQUE (RN007) ---
    const ajusteEstoqueForm = document.getElementById('ajuste-estoque-form');

    if (ajusteEstoqueForm) {
        ajusteEstoqueForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const itemNome = document.getElementById('item_estoque').value.trim();
            const quantidadeAjuste = parseInt(document.getElementById('quantidade_estoque').value);
            const tipo = document.getElementById('tipo_ajuste').value;
            
            let itemEstoque = estoque.find(i => i.item === itemNome);

            if (!itemEstoque) {
                if (confirm(`Item "${itemNome}" não encontrado. Deseja cadastrá-lo com a quantidade atual? (Mínimo padrão: 10)`)) {
                     itemEstoque = { item: itemNome, quantidade: quantidadeAjuste, minimo: 10 };
                     estoque.push(itemEstoque);
                     alert(`Item "${itemNome}" cadastrado e ajustado.`);
                } else {
                    ajusteEstoqueForm.reset();
                    return;
                }
            } else {
                if (tipo === 'entrada') {
                    itemEstoque.quantidade += quantidadeAjuste;
                } else if (tipo === 'saida') {
                    if (itemEstoque.quantidade >= quantidadeAjuste) {
                        itemEstoque.quantidade -= quantidadeAjuste;
                    } else {
                        alert(`ERRO (RN007): Não é possível dar baixa em ${quantidadeAjuste} unidades de ${itemNome}. Quantidade atual: ${itemEstoque.quantidade}.`);
                        ajusteEstoqueForm.reset();
                        return;
                    }
                }
                
                let acao = tipo === 'entrada' ? 'adicionada ao' : 'removida do';
                alert(`SUCESSO: ${quantidadeAjuste} unidades de ${itemNome} foram ${acao} estoque. Estoque atual: ${itemEstoque.quantidade}.`);
            }
            
            renderStockTable();
            checkLowStockAlerts();

            ajusteEstoqueForm.reset();
        });
    }
    
    // --- Outras Lógicas de Submissão de Formulários ---
    
    const cadastroPacienteForm = document.getElementById('cadastro-paciente-form');
    if (cadastroPacienteForm) {
        cadastroPacienteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome_completo').value;
            const dataNascimento = document.getElementById('data_nascimento').value;
            const telefone = document.getElementById('telefone').value;
            if (nome && dataNascimento && telefone) {
                alert(`SUCESSO (RN003): Paciente ${nome} cadastrado com sucesso! Dados básicos (Nome, Data Nasc., Telefone) verificados.`);
            } else {
                alert('ERRO: Preencha todos os campos obrigatórios.');
            }
            cadastroPacienteForm.reset();
            document.querySelector('.main-tabs .tab-button[data-tab="prontuario-view"]').click();
        });
    }

    const cadastroDentistaForm = document.getElementById('cadastro-dentista-form');
    if (cadastroDentistaForm) {
        cadastroDentistaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome_dentista').value;
            const cro = document.getElementById('cro').value;
            if (nome && cro) {
                alert(`SUCESSO (RN004): Dentista ${nome} (CRO: ${cro}) registrado com sucesso!`);
            } else {
                alert('ERRO: Nome e CRO são obrigatórios para registrar o profissional.');
            }
            cadastroDentistaForm.reset();
        });
    }
    
    const gerarRelatorioForm = document.getElementById('gerar-relatorio-form');
    if (gerarRelatorioForm) {
        gerarRelatorioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tipo = document.getElementById('tipo_relatorio').options[document.getElementById('tipo_relatorio').selectedIndex].text;
            const periodo = document.getElementById('periodo').options[document.getElementById('periodo').selectedIndex].text;
            alert(`SUCESSO (RN006/RF005): Relatório de "${tipo}" para o período "${periodo}" gerado em PDF com sucesso!`);
            gerarRelatorioForm.reset();
        });
    }

    const registrarTransacaoForm = document.getElementById('registrar-transacao-form');
    if (registrarTransacaoForm) {
        registrarTransacaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const descricao = document.getElementById('descricao').value;
            const valor = parseFloat(document.getElementById('valor').value);
            const tipo = document.getElementById('tipo_transacao').value;
            if (valor > 0) {
                const tipoTexto = tipo === 'receita' ? 'Receita' : 'Despesa';
                const valorFormatado = valor.toFixed(2).replace('.', ',');
                alert(`SUCESSO (RF003): Transação de ${tipoTexto} registrada. Descrição: "${descricao}" | Valor: R$ ${valorFormatado}.`);
                
                if (transacoesRecentes) {
                     const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                     const newRow = document.createElement('tr');
                     const statusClass = tipo === 'receita' ? 'pago' : 'pago'; 
                     const statusText = tipo === 'receita' ? 'Pago' : 'Resolvido';
                     newRow.innerHTML = `
                         <td>${hoje}</td>
                         <td>${descricao} (Registro Manual)</td>
                         <td class="${tipo}">${tipoTexto}</td>
                         <td class="${tipo}">R$ ${valorFormatado}</td>
                         <td class="${statusClass}">${statusText}</td>
                     `;
                     transacoesRecentes.prepend(newRow);
                }
            } else {
                alert('ERRO: O valor da transação deve ser positivo.');
            }
            registrarTransacaoForm.reset();
        });
    }

    const cadastroUsuarioForm = document.getElementById('cadastro-usuario-form');
    if (cadastroUsuarioForm) {
        cadastroUsuarioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = document.getElementById('novo_usuario').value;
            const perfil = document.getElementById('perfil_acesso').options[document.getElementById('perfil_acesso').selectedIndex].text;
            alert(`SUCESSO (RNF): Usuário "${usuario}" criado com o Perfil de Acesso "${perfil}". As permissões de acesso serão aplicadas no próximo login.`);
            cadastroUsuarioForm.reset();
        });
    }

});