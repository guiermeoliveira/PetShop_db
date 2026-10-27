// Catálogo com as 15 consultas relacionais contextualizadas
const queriesData = [
    {
        id: 1,
        title: "1. Pets, Tutores e Espécies (INNER JOIN)",
        desc: "Cruzamento entre pets, tutores e espécies para exibir a ficha de cadastro completa.",
        sql: `SELECT p.nome AS pet, e.nome AS especie, t.nome AS tutor, t.telefone\nFROM pets p\nINNER JOIN especies e ON p.id_especie = e.id_especie\nINNER JOIN tutores t ON p.id_tutor = t.id_tutor\nORDER BY p.nome ASC;`,
        headers: ["Pet", "Espécie", "Tutor", "Telefone"],
        rows: [
            ["Pipoca", "Canino", "Mariana Silva", "(11) 98765-4321"],
            ["Mingau", "Felino", "Lucas Fernandes", "(11) 97654-3210"],
            ["Thor", "Canino", "Carla Dias", "(11) 91234-5678"],
            ["Luna", "Felino", "Beatriz Rocha", "(11) 93456-7890"],
            ["Bob", "Canino", "Mariana Silva", "(11) 98765-4321"]
        ]
    },
    {
        id: 2,
        title: "2. Busca de Tutores por DDD ou Nome (LIKE & OR)",
        desc: "Localização de tutores com código de área específico ou com determinada terminação no sobrenome.",
        sql: `SELECT nome, telefone, email\nFROM tutores\nWHERE telefone LIKE '(11) 98%' OR nome LIKE '%Silva%'\nORDER BY nome;`,
        headers: ["Nome do Tutor", "Telefone", "E-mail"],
        rows: [
            ["Carlos Eduardo Silva", "(11) 98111-2233", "carlos.silva@email.com"],
            ["Mariana Silva", "(11) 98765-4321", "mariana.s@email.com"],
            ["Roberto Silveira", "(11) 98234-9988", "roberto@email.com"]
        ]
    },
    {
        id: 3,
        title: "3. Atendimentos em Período Específico (BETWEEN)",
        desc: "Filtra atendimentos clínicos realizados no intervalo quinzenal de auditoria.",
        sql: `SELECT id_atendimento, data_hora, diagnostico, status\nFROM atendimentos\nWHERE data_hora BETWEEN '2026-10-01' AND '2026-10-15'\nORDER BY data_hora DESC;`,
        headers: ["ID Atendimento", "Data/Hora", "Diagnóstico Clínico", "Status"],
        rows: [
            ["#1042", "2026-10-14 14:30", "Vacinação Polivalente V10", "Concluído"],
            ["#1039", "2026-10-11 10:15", "Dermatite alérgica leve", "Em Retorno"],
            ["#1035", "2026-10-06 16:00", "Tartarectomia profilática", "Concluído"],
            ["#1031", "2026-10-02 09:00", "Check-up preventivo anual", "Concluído"]
        ]
    },
    {
        id: 4,
        title: "4. Faturamento Total por Atendimento (SUM & GROUP BY)",
        desc: "Agrupamento dos itens consumidos por atendimento calculando a receita líquida.",
        sql: `SELECT a.id_atendimento, p.nome AS pet, SUM(i.quantidade * i.valor_unitario) AS total_faturado\nFROM atendimentos a\nINNER JOIN pets p ON a.id_pet = p.id_pet\nINNER JOIN itens_atendimento i ON a.id_atendimento = i.id_atendimento\nGROUP BY a.id_atendimento, p.nome\nORDER BY total_faturado DESC;`,
        headers: ["ID", "Nome do Pet", "Total Faturado (R$)"],
        rows: [
            ["#1035", "Thor", "R$ 480,00"],
            ["#1042", "Pipoca", "R$ 290,00"],
            ["#1031", "Mingau", "R$ 180,00"],
            ["#1039", "Luna", "R$ 145,00"]
        ]
    },
    {
        id: 5,
        title: "5. Tutores com Múltiplos Pets (HAVING & COUNT)",
        desc: "Identifica clientes fidelizados que possuem mais de 1 animal cadastrado na clínica.",
        sql: `SELECT t.nome AS tutor, COUNT(p.id_pet) AS total_pets\nFROM tutores t\nINNER JOIN pets p ON t.id_tutor = p.id_tutor\nGROUP BY t.id_tutor, t.nome\nHAVING COUNT(p.id_pet) > 1\nORDER BY total_pets DESC;`,
        headers: ["Tutor Fidelizado", "Quantidade de Pets"],
        rows: [
            ["Mariana Silva", "3 Pets"],
            ["Rodrigo Souza", "2 Pets"]
        ]
    },
    {
        id: 6,
        title: "6. Pets sem Atendimentos Registrados (LEFT JOIN & IS NULL)",
        desc: "Localiza animais que foram cadastrados mas ainda não agendaram nenhuma consulta ou procedimento.",
        sql: `SELECT p.id_pet, p.nome AS pet, t.nome AS tutor, t.telefone\nFROM pets p\nINNER JOIN tutores t ON p.id_tutor = t.id_tutor\nLEFT JOIN atendimentos a ON p.id_pet = a.id_pet\nWHERE a.id_atendimento IS NULL;`,
        headers: ["ID Pet", "Pet", "Tutor", "Contato para Retenção"],
        rows: [
            ["#78", "Bella (Golden)", "Camila Duarte", "(11) 94455-6677"],
            ["#82", "Frederico (Persa)", "Otávio Martins", "(11) 97788-9900"]
        ]
    },
    {
        id: 7,
        title: "7. Média de Idade dos Pets por Espécie (AVG & ROUND)",
        desc: "Média aritmética das idades calculada por espécie para planejamento de insumos veterinários.",
        sql: `SELECT e.nome AS especie, ROUND(AVG(p.idade), 1) AS media_idade, MAX(p.idade) AS pet_mais_idoso\nFROM pets p\nINNER JOIN especies e ON p.id_especie = e.id_especie\nGROUP BY e.nome;`,
        headers: ["Espécie", "Idade Média (Anos)", "Mais Idoso (Anos)"],
        rows: [
            ["Canino", "4.8 anos", "14 anos"],
            ["Felino", "3.2 anos", "11 anos"],
            ["Aves", "1.5 anos", "3 anos"]
        ]
    },
    {
        id: 8,
        title: "8. Serviços Mais Vendidos do Petshop (COUNT & LIMIT)",
        desc: "Ranking dos procedimentos com maior saída e volume no histórico da clínica.",
        sql: `SELECT s.nome_servico, COUNT(i.id_servico) AS total_realizados, s.preco_padrao\nFROM servicos s\nINNER JOIN itens_atendimento i ON s.id_servico = i.id_servico\nGROUP BY s.id_servico, s.nome_servico, s.preco_padrao\nORDER BY total_realizados DESC\nLIMIT 5;`,
        headers: ["Serviço", "Total Realizado", "Valor Padrão"],
        rows: [
            ["Banho e Tosa Higiênica", "142 vezes", "R$ 90,00"],
            ["Consulta Clínica Geral", "98 vezes", "R$ 150,00"],
            ["Aplicação Vacina V10", "65 vezes", "R$ 110,00"],
            ["Limpeza de Tártaro", "24 vezes", "R$ 350,00"]
        ]
    },
    {
        id: 9,
        title: "9. Veterinários e Total de Consultas Realizadas (GROUP BY)",
        desc: "Mapeamento da produtividade do corpo médico veterinário.",
        sql: `SELECT v.nome, v.crmv, COUNT(a.id_atendimento) AS total_consultas\nFROM veterinarios v\nLEFT JOIN atendimentos a ON v.id_veterinario = a.id_veterinario\nGROUP BY v.id_veterinario, v.nome, v.crmv\nORDER BY total_consultas DESC;`,
        headers: ["Médico Veterinário", "CRMV", "Atendimentos"],
        rows: [
            ["Dra. Helena Castro", "CRMV-SP 45.120", "84 consultas"],
            ["Dr. Gabriel Prado", "CRMV-SP 39.881", "67 consultas"],
            ["Dra. Fernanda Lins", "CRMV-SP 51.004", "41 consultas"]
        ]
    },
    {
        id: 10,
        title: "10. Tutores Residentes em Bairros Selecionados (IN & WHERE)",
        desc: "Filtragem geográfica por múltiplos bairros para campanhas direcionadas de táxi-pet.",
        sql: `SELECT t.nome, e.bairro, e.cidade\nFROM tutores t\nINNER JOIN enderecos e ON t.id_endereco = e.id_endereco\nWHERE e.bairro IN ('Moema', 'Pinheiros', 'Perdizes', 'Vila Mariana')\nORDER BY e.bairro ASC;`,
        headers: ["Tutor", "Bairro", "Cidade"],
        rows: [
            ["Mariana Silva", "Moema", "São Paulo"],
            ["Juliana Alencar", "Perdizes", "São Paulo"],
            ["Lucas Fernandes", "Pinheiros", "São Paulo"],
            ["Carla Dias", "Vila Mariana", "São Paulo"]
        ]
    },
    {
        id: 11,
        title: "11. Faturamento Total Acumulado por Mês (SUM & EXTRACT)",
        desc: "Soma das receitas financeiras consolidadas agrupadas por mês.",
        sql: `SELECT EXTRACT(MONTH FROM a.data_hora) AS mes, SUM(i.quantidade * i.valor_unitario) AS faturamento_mensal\nFROM atendimentos a\nINNER JOIN itens_atendimento i ON a.id_atendimento = i.id_atendimento\nGROUP BY mes\nORDER BY mes DESC;`,
        headers: ["Mês Referência", "Faturamento Consolidado"],
        rows: [
            ["Mês 10 (Outubro)", "R$ 34.820,00"],
            ["Mês 09 (Setembro)", "R$ 29.450,00"],
            ["Mês 08 (Agosto)", "R$ 31.100,00"]
        ]
    },
    {
        id: 12,
        title: "12. Medicamentos com Estoque Crítico (WHERE & <=)",
        desc: "Alerta de farmácia para itens que atingiram ou ficaram abaixo do ponto de reposição.",
        sql: `SELECT nome_produto, categoria, quantidade_estoque, ponto_reposicao\nFROM produtos\nWHERE quantidade_estoque <= ponto_reposicao\nORDER BY quantidade_estoque ASC;`,
        headers: ["Produto Farmacêutico", "Categoria", "Estoque Atual", "Nível Crítico"],
        rows: [
            ["Antipulgas Bravecto 10-20kg", "Parasiticida", "2 un.", "Min. 5 un."],
            ["Vermífugo Drontal Plus", "Vermífugo", "3 un.", "Min. 8 un."],
            ["Pomada Otológica Otomax", "Dermatológico", "4 un.", "Min. 6 un."]
        ]
    },
    {
        id: 13,
        title: "13. Pets Idosos com Histórico Cirúrgico (WHERE & AND)",
        desc: "Cruzamento para triagem de risco cirúrgico e acompanhamento de rotina geriátrica.",
        sql: `SELECT p.nome AS pet, p.raca, p.idade, a.diagnostico\nFROM pets p\nINNER JOIN atendimentos a ON p.id_pet = a.id_pet\nWHERE p.idade >= 8 AND a.tipo_atendimento = 'Cirúrgico'\nORDER BY p.idade DESC;`,
        headers: ["Pet", "Raça", "Idade", "Último Procedimento"],
        rows: [
            ["Thor", "Pastor Alemão", "11 anos", "Remoção de Nódulo Cutâneo"],
            ["Billy", "Poodle", "9 anos", "Profilaxia Dentária com Sedação"]
        ]
    },
    {
        id: 14,
        title: "14. Ticket Médio Gasto por Consulta (AVG & Subquery)",
        desc: "Cálculo do valor médio investido por atendimento veterinário na clínica.",
        sql: `SELECT ROUND(AVG(total_por_consulta), 2) AS ticket_medio_geral\nFROM (\n  SELECT a.id_atendimento, SUM(i.quantidade * i.valor_unitario) AS total_por_consulta\n  FROM atendimentos a\n  INNER JOIN itens_atendimento i ON a.id_atendimento = i.id_atendimento\n  GROUP BY a.id_atendimento\n) AS consolidado;`,
        headers: ["Métrica de Inteligência", "Valor Apurado"],
        rows: [
            ["Ticket Médio por Consulta Veterinária", "R$ 214,80"]
        ]
    },
    {
        id: 15,
        title: "15. Auditoria de Tutores sem Telefone Válido (IS NULL ou Vazio)",
        desc: "Identifica cadastros pendentes de contato para o envio de avisos vacinais.",
        sql: `SELECT id_tutor, nome, email, data_cadastro\nFROM tutores\nWHERE telefone IS NULL OR telefone = ''\nORDER BY data_cadastro DESC;`,
        headers: ["ID Tutor", "Nome", "E-mail de Contato", "Data Cadastro"],
        rows: [
            ["#204", "Felipe Nogueira", "felipe.nog@email.com", "2026-10-18"],
            ["#198", "Renata Meireles", "renatameir@email.com", "2026-09-29"]
        ]
    }
];

// Captura de Elementos do DOM
const selectEl = document.getElementById('querySelect');
const btnExecutar = document.getElementById('btnExecutar');
const queryDesc = document.getElementById('queryDescription');
const sqlCode = document.getElementById('sqlCode');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const tableCounter = document.getElementById('tableCounter');

// Inicialização: Preenche o select com as 15 consultas
function initSelect() {
    queriesData.forEach((q) => {
        const opt = document.createElement('option');
        opt.value = q.id;
        opt.textContent = q.title;
        selectEl.appendChild(opt);
    });
    atualizarDescricao();
}

// Atualiza o texto explicativo ao alterar o select
function atualizarDescricao() {
    const selected = queriesData.find(q => q.id === parseInt(selectEl.value));
    if (selected) {
        queryDesc.textContent = selected.desc;
    }
}

// Executa a consulta selecionada e preenche a tabela e código
function executarConsulta() {
    const selected = queriesData.find(q => q.id === parseInt(selectEl.value));
    if (!selected) return;

    sqlCode.textContent = selected.sql;
    tableHead.innerHTML = selected.headers.map(h => `<th>${h}</th>`).join('');

    tableBody.innerHTML = selected.rows.map(row => {
        return `<tr>${row.map(col => `<td>${col}</td>`).join('')}</tr>`;
    }).join('');

    tableCounter.textContent = `${selected.rows.length} registros`;
}

// Event Listeners
selectEl.addEventListener('change', atualizarDescricao);
btnExecutar.addEventListener('click', executarConsulta);

// Inicialização direta ao abrir a página
initSelect();
executarConsulta();