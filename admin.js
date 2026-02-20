/**
 * PAINEL ADMINISTRATIVO - RD Volantes
 * 
 * Gerencia a visualização de todos os orçamentos e clientes
 */

let orcamentosGlobal = [];
let clientesGlobal = [];
let abaAtual = 'orcamentos';
let filtroAtual = '';

/**
 * Inicializar painel admin
 */
async function inicializarAdmin() {
    const usuario = usuarioLogado();
    
    console.log('👤 Usuário logado:', usuario);
    console.log('🔐 É admin?', usuario?.isAdmin);
    console.log('📧 Email:', usuario?.email);
    
    // Verificar se é admin
    if (!usuario) {
        document.getElementById('admin-content').innerHTML = `
            <div class="access-denied">
                <h2>❌ Você não está logado</h2>
                <p>Faça login para acessar o painel administrativo.</p>
                <a href="login.html" class="btn-voltar">Fazer Login</a>
            </div>
        `;
        return;
    }
    
    if (!usuario.isAdmin) {
        document.getElementById('admin-content').innerHTML = `
            <div class="access-denied">
                <h2>❌ Acesso Negado</h2>
                <p>Este painel é exclusivo para administradores.</p>
                <p style="color: #888; font-size: 14px; margin-top: 10px;">
                    Email: ${usuario.email}<br>
                    IsAdmin: ${usuario.isAdmin}<br>
                    <br>
                    Para ter acesso admin, faça login com: adm.rdvolantes@gmail.com
                </p>
                <a href="index.html" class="btn-voltar">Voltar ao Início</a>
            </div>
        `;
        return;
    }
    
    // Exibir informações do usuário admin
    const nomeAdmin = usuario.nome || usuario.email.split('@')[0];
    document.getElementById('admin-user-info').innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span>👤 ${nomeAdmin}</span>
            <button onclick="abrirModalTrocarSenha()" style="background: none; border: none; cursor: pointer; color: #666; font-size: 18px; padding: 5px; hover: color: #d84040;" title="Trocar senha">🔐</button>
        </div>
    `;
    
    // Adicionar event listeners aos botões de aba
    document.querySelectorAll('.admin-menu-item').forEach(btn => {
        btn.addEventListener('click', mudarAba);
    });
    
    // Carregar dados
    await carregarDados();
    
    // Mostrar aba inicial
    mostrarAba('orcamentos');
}

/**
 * Mudar aba
 */
function mudarAba(e) {
    const aba = e.currentTarget.getAttribute('data-tab');
    mostrarAba(aba);
}

/**
 * Mostrar aba específica
 */
function mostrarAba(aba) {
    abaAtual = aba;
    filtroAtual = '';
    
    // Atualizar botões active
    document.querySelectorAll('.admin-menu-item').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${aba}"]`).classList.add('active');
    
    // Renderizar conteúdo
    if (aba === 'orcamentos') {
        renderizarOrcamentos();
    } else if (aba === 'clientes') {
        renderizarClientes();
    }
}

/**
 * Carregar todos os dados
 */
async function carregarDados() {
    try {
        const resultadoOrc = await buscarTodosOrcamentos();
        const resultadoCli = await buscarTodosClientes();
        
        if (resultadoOrc.sucesso) {
            orcamentosGlobal = resultadoOrc.orcamentos || [];
        }
        
        if (resultadoCli.sucesso) {
            clientesGlobal = resultadoCli.clientes || [];
        }
        
    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
    }
}

/**
 * Renderizar aba de orçamentos
 */
function renderizarOrcamentos() {
    const orcamentosPorCliente = agruparPorCliente(orcamentosGlobal);
    
    const stats = calcularEstatisticas(orcamentosGlobal);
    
    let html = '';
    
    // Filtros
    html += `
        <div class="filtros" style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <input 
                type="text" 
                id="filtro-cliente" 
                placeholder="🔍 Filtrar por cliente, email ou CNPJ..."
                onkeyup="filtrarOrcamentos()"
                style="flex: 1; min-width: 250px;">
            
            <div style="display: flex; gap: 8px; align-items: center;">
                <label style="font-size: 14px; color: #555; white-space: nowrap;">📅 Período:</label>
                <input 
                    type="date" 
                    id="filtro-data-inicio" 
                    onchange="filtrarOrcamentos()"
                    style="padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                <span style="color: #999;">até</span>
                <input 
                    type="date" 
                    id="filtro-data-fim" 
                    onchange="filtrarOrcamentos()"
                    style="padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
            </div>
            
            <button onclick="limparFiltro()" style="white-space: nowrap;">Limpar Filtro</button>
        </div>
    `;
    
    // Estatísticas
    html += `
        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">📊 Total de Clientes</div>
                <div class="stat-value">${stats.totalClientes}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">📋 Total de Orçamentos</div>
                <div class="stat-value">${stats.totalOrcamentos}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">💰 Valor Total</div>
                <div class="stat-value">${formatarMoeda(stats.valorTotal)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">🎯 Ticket Médio</div>
                <div class="stat-value">${formatarMoeda(stats.ticketMedio)}</div>
            </div>
        </div>
    `;
    
    // Orçamentos por cliente
    if (Object.keys(orcamentosPorCliente).length === 0) {
        html += `
            <div class="empty-state">
                <h3>Nenhum orçamento encontrado</h3>
                <p>Não há orçamentos registrados no sistema.</p>
            </div>
        `;
    } else {
        for (const [clienteId, dados] of Object.entries(orcamentosPorCliente)) {
            html += renderizarClienteSection(dados);
        }
    }
    
    document.getElementById('admin-content').innerHTML = html;
    
    // Adicionar event listeners para expansão/colapso
    document.querySelectorAll('.cliente-header').forEach(header => {
        header.addEventListener('click', toggleClienteSection);
    });
}

/**
 * Renderizar aba de clientes
 */
function renderizarClientes() {
    let html = '';
    
    // Filtros
    html += `
        <div class="filtros">
            <input 
                type="text" 
                id="filtro-cliente" 
                placeholder="🔍 Filtrar por nome, email ou CNPJ..."
                onkeyup="filtrarClientes()">
            <button onclick="limparFiltro()">Limpar Filtro</button>
        </div>
    `;
    
    // Estatísticas
    const totalClientes = clientesGlobal.length;
    let totalPF = 0, totalPJ = 0;
    
    clientesGlobal.forEach(cliente => {
        if (cliente.tipoPessoa === 'fisica') totalPF++;
        else if (cliente.tipoPessoa === 'juridica') totalPJ++;
    });
    
    html += `
        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">👥 Total de Clientes</div>
                <div class="stat-value">${totalClientes}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">👤 Pessoa Física</div>
                <div class="stat-value">${totalPF}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">🏢 Pessoa Jurídica</div>
                <div class="stat-value">${totalPJ}</div>
            </div>
        </div>
    `;
    
    // Grid de clientes
    if (clientesGlobal.length === 0) {
        html += `
            <div class="empty-state">
                <h3>Nenhum cliente registrado</h3>
                <p>Não há clientes no sistema.</p>
            </div>
        `;
    } else {
        html += '<div class="clientes-grid">';
        
        clientesGlobal.forEach(cliente => {
            const iniciais = ((cliente.razaoSocial || cliente.fantasia || 'C').split(' ')[0] || 'C').substring(0, 2).toUpperCase();
            const tipoPessoa = cliente.tipoPessoa === 'fisica' ? '👤 PF' : '🏢 PJ';
            const documento = cliente.tipoPessoa === 'fisica' ? cliente.cpf : cliente.cnpj;
            
            // Contar orçamentos do cliente
            const totalOrcamentos = orcamentosGlobal.filter(o => o.clienteId === cliente.id).length;
            
            // Calcular valor total dos orçamentos
            let totalValor = 0;
            orcamentosGlobal.forEach(o => {
                if (o.clienteId === cliente.id) {
                    const total = (o.itens || []).reduce((sum, item) => 
                        sum + ((item.valor || 0) * (item.qtd || 1)), 0
                    );
                    totalValor += total;
                }
            });
            
            html += `
                <div class="cliente-card" onclick="abrirDetalheCliente('${cliente.id}')">
                    <div class="cliente-card-header">
                        <div class="cliente-avatar">${iniciais}</div>
                        <div class="cliente-card-info">
                            <h3>${cliente.razaoSocial || cliente.fantasia || 'Cliente'}</h3>
                            <p>${cliente.email}</p>
                        </div>
                    </div>
                    
                    <div style="padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; font-size: 13px;">
                        <div style="color: #666; margin-bottom: 6px;"><strong>${tipoPessoa}</strong></div>
                        <div style="color: #999; font-size: 12px;">
                            ${documento ? '📎 ' + documento : 'Sem documento'}
                        </div>
                    </div>
                    
                    <div class="cliente-card-stats">
                        <div class="stat-mini">
                            <div class="stat-mini-value">${totalOrcamentos}</div>
                            <div class="stat-mini-label">Orçamentos</div>
                        </div>
                        <div class="stat-mini">
                            <div class="stat-mini-value">${formatarMoeda(totalValor).split(',')[0]}</div>
                            <div class="stat-mini-label">Valor Total</div>
                        </div>
                    </div>
                    
                    ${cliente.telefone ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                            <div style="font-size: 12px; color: #999;">📞 ${cliente.telefone}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    document.getElementById('admin-content').innerHTML = html;
}

/**
 * Abrir detalhes do cliente (admin pode ver valores)
 */
function abrirDetalheCliente(clienteId) {
    const cliente = clientesGlobal.find(c => c.id === clienteId);
    if (!cliente) return;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <button class="btn-voltar" onclick="mostrarAba('clientes')">← Voltar à Lista</button>
        </div>
        
        <div class="cliente-section">
            <div class="cliente-header">
                <h3>${cliente.razaoSocial || cliente.fantasia || 'Cliente'}</h3>
                <button class="btn-delete" onclick="confirmarDeletarCliente('${clienteId}')" style="background: #e74c3c; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; font-size: 14px;">🗑️ Deletar Cliente</button>
            </div>
            <div class="cliente-orcamentos" style="padding: 30px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <div style="color: #999; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">Email</div>
                        <div style="font-size: 15px; font-weight: 600; color: #333;">${cliente.email}</div>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <div style="color: #999; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">Tipo Pessoa</div>
                        <div style="font-size: 15px; font-weight: 600; color: #d84040;">
                            ${cliente.tipoPessoa === 'fisica' ? '👤 Pessoa Física' : '🏢 Pessoa Jurídica'}
                        </div>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <div style="color: #999; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">Telefone</div>
                        <div style="font-size: 15px; font-weight: 600; color: #333;">${cliente.telefone || 'N/A'}</div>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <div style="color: #999; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">Documento</div>
                        <div style="font-size: 15px; font-weight: 600; color: #333;">
                            ${cliente.tipoPessoa === 'fisica' ? cliente.cpf || 'N/A' : cliente.cnpj || 'N/A'}
                        </div>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <div style="color: #999; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">Data Cadastro</div>
                        <div style="font-size: 15px; font-weight: 600; color: #333;">${cliente.dataCadastro ? new Date(cliente.dataCadastro).toLocaleDateString('pt-BR') : 'N/A'}</div>
                    </div>
                </div>
                
                <h3 style="margin: 30px 0 15px 0; color: #333;">Orçamentos do Cliente</h3>
                ${renderizarOrcamentosCliente(cliente.id)}
            </div>
        </div>
    `;
    
    document.getElementById('admin-content').innerHTML = html;
}

/**
 * Renderizar orçamentos de um cliente específico (apenas para admin)
 */
function renderizarOrcamentosCliente(clienteId) {
    const orcamentos = orcamentosGlobal.filter(o => o.clienteId === clienteId);
    
    if (orcamentos.length === 0) {
        return '<div class="empty-state"><p>Este cliente não possui orçamentos.</p></div>';
    }
    
    let html = '<div style="max-height: 600px; overflow-y: auto; overflow-x: hidden; padding-right: 10px;">';
    orcamentos.forEach(orc => {
        const dataFormatada = formatarData(orc.data);
        const itensHTML = (orc.itens || []).map(item => `
            <tr>
                <td class="item-codigo">${item.codigo || 'N/A'}</td>
                <td class="item-descricao">${item.descricao || 'Sem descrição'}</td>
                <td style="text-align: center; color: #666;">${item.qtd || 1}</td>
                <td class="item-valor">${formatarMoeda(item.valor || 0)}</td>
                <td class="item-valor">${formatarMoeda((item.valor || 0) * (item.qtd || 1))}</td>
            </tr>
        `).join('');
        
        const totalOrcamento = (orc.itens || []).reduce((sum, item) => 
            sum + ((item.valor || 0) * (item.qtd || 1)), 0
        );
        
        html += `
            <div class="orcamento-item">
                <div class="orcamento-meta">
                    <div>
                        <div class="orcamento-id">#${orc.id}</div>
                        <div class="orcamento-data">📅 ${dataFormatada}</div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <div class="orcamento-valor">${formatarMoeda(totalOrcamento)}</div>
                        <button class="btn-export-pdf" onclick="exportarOrcamentoPDF('${orc.id}')" style="background: #3498db; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">📄 PDF</button>
                        <button class="btn-export-csv" onclick="exportarOrcamentoCSV('${orc.id}')" style="background: #27ae60; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">📊 CSV</button>
                    </div>
                </div>
                
                ${orc.itens && orc.itens.length > 0 ? `
                    <table class="orcamento-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Qtd</th>
                                <th>V. Unit.</th>
                                <th>V. Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itensHTML}
                        </tbody>
                    </table>
                ` : '<p style="color: #999; margin: 10px 0;">Sem itens</p>'}
                
                ${orc.observacao ? `
                    <div class="orcamento-obs">
                        <strong>📝 Observação:</strong> ${orc.observacao}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

/**
 * Renderizar seção de cliente (nos orçamentos)
 */
function renderizarClienteSection(dados) {
    const { cliente, orcamentos, totalCliente } = dados;
    const clienteNome = cliente.nome || cliente.email || 'Cliente Desconhecido';
    const clienteCNPJ = cliente.cnpj || 'N/A';
    const clienteEmail = cliente.email || 'N/A';
    
    let html = `
        <div class="cliente-section">
            <div class="cliente-header">
                <div>
                    <h3>${clienteNome}</h3>
                    <div class="cliente-info">
                        <div class="info-badge">📧 ${clienteEmail}</div>
                        <div class="info-badge">🏢 ${clienteCNPJ}</div>
                        <div class="info-badge">📊 ${orcamentos.length} orçamento(s)</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="color: #20c997; font-weight: 600; font-size: 16px;">
                        ${formatarMoeda(totalCliente)}
                    </div>
                    <div class="toggle-icon">▼</div>
                </div>
            </div>
            
            <div class="cliente-orcamentos">
    `;
    
    // Listar orçamentos do cliente
    orcamentos.forEach(orc => {
        const dataFormatada = formatarData(orc.data);
        const itensHTML = (orc.itens || []).map(item => `
            <tr>
                <td class="item-codigo">${item.codigo || 'N/A'}</td>
                <td class="item-descricao">${item.descricao || 'Sem descrição'}</td>
                <td style="text-align: center; color: #666;">${item.qtd || 1}</td>
                <td class="item-valor">${formatarMoeda(item.valor || 0)}</td>
                <td class="item-valor">${formatarMoeda((item.valor || 0) * (item.qtd || 1))}</td>
            </tr>
        `).join('');
        
        const totalOrcamento = (orc.itens || []).reduce((sum, item) => 
            sum + ((item.valor || 0) * (item.qtd || 1)), 0
        );
        
        html += `
            <div class="orcamento-item">
                <div class="orcamento-meta">
                    <div>
                        <div class="orcamento-id">#${orc.id}</div>
                        <div class="orcamento-data">📅 ${dataFormatada}</div>
                    </div>
                    <div class="orcamento-valor">${formatarMoeda(totalOrcamento)}</div>
                </div>
                
                ${orc.itens && orc.itens.length > 0 ? `
                    <table class="orcamento-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Qtd</th>
                                <th>V. Unit.</th>
                                <th>V. Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itensHTML}
                        </tbody>
                    </table>
                ` : '<p style="color: #999; margin: 10px 0;">Sem itens</p>'}
                
                ${orc.observacao ? `
                    <div class="orcamento-obs">
                        <strong>📝 Observação:</strong> ${orc.observacao}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

/**
 * Agrupar orçamentos por cliente
 */
function agruparPorCliente(orcamentos) {
    const agrupado = {};
    
    orcamentos.forEach(orc => {
        const clienteId = orc.clienteId || 'desconhecido';
        
        if (!agrupado[clienteId]) {
            agrupado[clienteId] = {
                cliente: {
                    id: clienteId,
                    nome: orc.clienteNome || '',
                    email: orc.clienteEmail || '',
                    cnpj: orc.clienteCNPJ || ''
                },
                orcamentos: [],
                totalCliente: 0
            };
        }
        
        // Calcular total do orçamento
        const totalOrcamento = (orc.itens || []).reduce((sum, item) => 
            sum + ((item.valor || 0) * (item.qtd || 1)), 0
        );
        
        agrupado[clienteId].orcamentos.push(orc);
        agrupado[clienteId].totalCliente += totalOrcamento;
    });
    
    // Ordenar clientes por valor total (descendente)
    const ordenado = Object.entries(agrupado)
        .sort((a, b) => b[1].totalCliente - a[1].totalCliente)
        .reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj;
        }, {});
    
    return ordenado;
}

/**
 * Calcular estatísticas
 */
function calcularEstatisticas(orcamentos) {
    let totalClientes = 0;
    let totalOrcamentos = orcamentos.length;
    let valorTotal = 0;
    const clientesUnicos = new Set();
    
    orcamentos.forEach(orc => {
        clientesUnicos.add(orc.clienteId || orc.clienteEmail);
        
        const totalOrcamento = (orc.itens || []).reduce((sum, item) => 
            sum + ((item.valor || 0) * (item.qtd || 1)), 0
        );
        
        valorTotal += totalOrcamento;
    });
    
    totalClientes = clientesUnicos.size;
    
    return {
        totalClientes,
        totalOrcamentos,
        valorTotal,
        ticketMedio: totalOrcamentos > 0 ? valorTotal / totalOrcamentos : 0
    };
}

/**
 * Alternar expansão/colapso de seção de cliente
 */
function toggleClienteSection(e) {
    if (e.target.closest('input, button, a')) return;
    
    const header = e.currentTarget;
    const section = header.nextElementSibling;
    
    header.classList.toggle('collapsed');
    section.classList.toggle('hidden');
}

/**
 * Filtrar orçamentos
 */
function filtrarOrcamentos() {
    const filtro = document.getElementById('filtro-cliente').value.toLowerCase();
    const dataInicioInput = document.getElementById('filtro-data-inicio')?.value;
    const dataFimInput = document.getElementById('filtro-data-fim')?.value;
    
    filtroAtual = filtro;
    
    // Se não tem nenhum filtro, renderizar tudo
    if (!filtro && !dataInicioInput && !dataFimInput) {
        renderizarOrcamentos();
        return;
    }
    
    // Converter datas para objetos Date (início do dia e fim do dia)
    const dataInicio = dataInicioInput ? new Date(dataInicioInput + 'T00:00:00') : null;
    const dataFim = dataFimInput ? new Date(dataFimInput + 'T23:59:59') : null;
    
    // Filtrar orçamentos
    const orcamentosFiltrados = orcamentosGlobal.filter(orc => {
        // Filtro de texto
        let matchTexto = true;
        if (filtro) {
            const nome = (orc.clienteNome || '').toLowerCase();
            const email = (orc.clienteEmail || '').toLowerCase();
            const cnpj = (orc.clienteCNPJ || '').toLowerCase();
            matchTexto = nome.includes(filtro) || email.includes(filtro) || cnpj.includes(filtro);
        }
        
        // Filtro de data
        let matchData = true;
        if (dataInicio || dataFim) {
            const dataOrcamento = new Date(orc.data);
            
            if (dataInicio && dataOrcamento < dataInicio) {
                matchData = false;
            }
            if (dataFim && dataOrcamento > dataFim) {
                matchData = false;
            }
        }
        
        return matchTexto && matchData;
    });
    
    // Renderizar só os filtrados
    const orcamentosPorCliente = agruparPorCliente(orcamentosFiltrados);
    
    let html = `
        <div class="filtros" style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <input 
                type="text" 
                id="filtro-cliente" 
                placeholder="🔍 Filtrar por cliente, email ou CNPJ..."
                value="${filtro}"
                onkeyup="filtrarOrcamentos()"
                style="flex: 1; min-width: 250px;">
            
            <div style="display: flex; gap: 8px; align-items: center;">
                <label style="font-size: 14px; color: #555; white-space: nowrap;">📅 Período:</label>
                <input 
                    type="date" 
                    id="filtro-data-inicio" 
                    value="${dataInicioInput || ''}"
                    onchange="filtrarOrcamentos()"
                    style="padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                <span style="color: #999;">até</span>
                <input 
                    type="date" 
                    id="filtro-data-fim" 
                    value="${dataFimInput || ''}"
                    onchange="filtrarOrcamentos()"
                    style="padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
            </div>
            
            <button onclick="limparFiltro()" style="white-space: nowrap;">Limpar Filtro</button>
        </div>
    `;
    
    if (Object.keys(orcamentosPorCliente).length === 0) {
        let mensagemFiltros = [];
        if (filtro) mensagemFiltros.push(`texto "${filtro}"`);
        if (dataInicioInput || dataFimInput) {
            let periodo = '';
            if (dataInicioInput && dataFimInput) {
                periodo = `período de ${new Date(dataInicioInput).toLocaleDateString('pt-BR')} até ${new Date(dataFimInput).toLocaleDateString('pt-BR')}`;
            } else if (dataInicioInput) {
                periodo = `a partir de ${new Date(dataInicioInput).toLocaleDateString('pt-BR')}`;
            } else {
                periodo = `até ${new Date(dataFimInput).toLocaleDateString('pt-BR')}`;
            }
            mensagemFiltros.push(periodo);
        }
        
        html += `
            <div class="empty-state">
                <h3>Nenhum orçamento encontrado</h3>
                <p>Nenhum orçamento corresponde aos filtros: ${mensagemFiltros.join(' e ')}</p>
            </div>
        `;
    } else {
        for (const [clienteId, dados] of Object.entries(orcamentosPorCliente)) {
            html += renderizarClienteSection(dados);
        }
    }
    
    document.getElementById('admin-content').innerHTML = html;
    
    // Adicionar event listeners
    document.querySelectorAll('.cliente-header').forEach(header => {
        header.addEventListener('click', toggleClienteSection);
    });
}

/**
 * Filtrar clientes
 */
function filtrarClientes() {
    const filtro = document.getElementById('filtro-cliente').value.toLowerCase();
    filtroAtual = filtro;
    
    if (!filtro) {
        renderizarClientes();
        return;
    }
    
    // Filtrar clientes
    const clientesFiltrados = clientesGlobal.filter(cliente => {
        const nome = (cliente.razaoSocial || cliente.fantasia || '').toLowerCase();
        const email = (cliente.email || '').toLowerCase();
        const cnpj = (cliente.cnpj || '').toLowerCase();
        
        return nome.includes(filtro) || email.includes(filtro) || cnpj.includes(filtro);
    });
    
    let html = `
        <div class="filtros">
            <input 
                type="text" 
                id="filtro-cliente" 
                placeholder="🔍 Filtrar por nome, email ou CNPJ..."
                value="${filtro}"
                onkeyup="filtrarClientes()">
            <button onclick="limparFiltro()">Limpar Filtro</button>
        </div>
    `;
    
    if (clientesFiltrados.length === 0) {
        html += `
            <div class="empty-state">
                <h3>Nenhum cliente encontrado</h3>
                <p>Nenhum cliente corresponde a "${filtro}"</p>
            </div>
        `;
    } else {
        html += '<div class="clientes-grid">';
        
        clientesFiltrados.forEach(cliente => {
            const iniciais = ((cliente.razaoSocial || cliente.fantasia || 'C').split(' ')[0] || 'C').substring(0, 2).toUpperCase();
            const tipoPessoa = cliente.tipoPessoa === 'fisica' ? '👤 PF' : '🏢 PJ';
            const documento = cliente.tipoPessoa === 'fisica' ? cliente.cpf : cliente.cnpj;
            
            // Contar orçamentos do cliente
            const totalOrcamentos = orcamentosGlobal.filter(o => o.clienteId === cliente.id).length;
            
            // Calcular valor total dos orçamentos
            let totalValor = 0;
            orcamentosGlobal.forEach(o => {
                if (o.clienteId === cliente.id) {
                    const total = (o.itens || []).reduce((sum, item) => 
                        sum + ((item.valor || 0) * (item.qtd || 1)), 0
                    );
                    totalValor += total;
                }
            });
            
            html += `
                <div class="cliente-card" onclick="abrirDetalheCliente('${cliente.id}')">
                    <div class="cliente-card-header">
                        <div class="cliente-avatar">${iniciais}</div>
                        <div class="cliente-card-info">
                            <h3>${cliente.razaoSocial || cliente.fantasia || 'Cliente'}</h3>
                            <p>${cliente.email}</p>
                        </div>
                    </div>
                    
                    <div style="padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; font-size: 13px;">
                        <div style="color: #666; margin-bottom: 6px;"><strong>${tipoPessoa}</strong></div>
                        <div style="color: #999; font-size: 12px;">
                            ${documento ? '📎 ' + documento : 'Sem documento'}
                        </div>
                    </div>
                    
                    <div class="cliente-card-stats">
                        <div class="stat-mini">
                            <div class="stat-mini-value">${totalOrcamentos}</div>
                            <div class="stat-mini-label">Orçamentos</div>
                        </div>
                        <div class="stat-mini">
                            <div class="stat-mini-value">${formatarMoeda(totalValor).split(',')[0]}</div>
                            <div class="stat-mini-label">Valor Total</div>
                        </div>
                    </div>
                    
                    ${cliente.telefone ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                            <div style="font-size: 12px; color: #999;">📞 ${cliente.telefone}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    document.getElementById('admin-content').innerHTML = html;
}

/**
 * Limpar filtro
 */
function limparFiltro() {
    document.getElementById('filtro-cliente').value = '';
    
    // Limpar filtros de data (se existirem)
    const dataInicio = document.getElementById('filtro-data-inicio');
    const dataFim = document.getElementById('filtro-data-fim');
    if (dataInicio) dataInicio.value = '';
    if (dataFim) dataFim.value = '';
    
    filtroAtual = '';
    
    if (abaAtual === 'orcamentos') {
        renderizarOrcamentos();
    } else {
        renderizarClientes();
    }
}

/**
 * Formatar moeda
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
}

/**
 * Formatar data
 */
function formatarData(data) {
    if (!data) return 'Data desconhecida';
    
    try {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return data;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarAdmin);

/**
 * Carregar todos os orçamentos
 */
async function carregarOrcamentos() {
    try {
        const resultado = await buscarTodosOrcamentos();
        
        if (!resultado.sucesso) {
            document.getElementById('admin-content').innerHTML = `
                <div class="access-denied">
                    <h2>⚠️ ${resultado.mensagem}</h2>
                    <a href="index.html" class="btn-voltar">Voltar ao Início</a>
                </div>
            `;
            return;
        }
        
        orcamentosGlobal = resultado.orcamentos || [];
        renderizarPainel();
        
    } catch (erro) {
        console.error('Erro ao carregar orçamentos:', erro);
        document.getElementById('admin-content').innerHTML = `
            <div class="access-denied">
                <h2>❌ Erro ao Carregar</h2>
                <p>Não foi possível carregar os orçamentos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

/**
 * Renderizar painel completo
 */
function renderizarPainel() {
    // Agrupar orçamentos por cliente
    const orcamentosPorCliente = agruparPorCliente(orcamentosGlobal);
    
    // Calcular estatísticas
    const stats = calcularEstatisticas(orcamentosGlobal);
    
    // HTML do painel
    let html = '';
    
    // Filtros
    html += `
        <div class="filtros">
            <input 
                type="text" 
                id="filtro-cliente" 
                placeholder="🔍 Filtrar por cliente, email ou CNPJ..."
                onkeyup="filtrarOrcamentos()">
            <button onclick="limparFiltro()">Limpar</button>
        </div>
    `;
    
    // Estatísticas
    html += `
        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">Total de Clientes</div>
                <div class="stat-value">${stats.totalClientes}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total de Orçamentos</div>
                <div class="stat-value">${stats.totalOrcamentos}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Valor Total</div>
                <div class="stat-value">${formatarMoeda(stats.valorTotal)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Ticket Médio</div>
                <div class="stat-value">${formatarMoeda(stats.ticketMedio)}</div>
            </div>
        </div>
    `;
    
    // Orçamentos por cliente
    if (Object.keys(orcamentosPorCliente).length === 0) {
        html += `
            <div class="empty-state">
                <h3>Nenhum orçamento encontrado</h3>
                <p>Não há orçamentos registrados no sistema.</p>
            </div>
        `;
    } else {
        for (const [clienteId, dados] of Object.entries(orcamentosPorCliente)) {
            html += renderizarClienteSection(dados);
        }
    }
    
    document.getElementById('admin-content').innerHTML = html;
    
    // Adicionar event listeners para expansão/colapso
    document.querySelectorAll('.cliente-header').forEach(header => {
        header.addEventListener('click', toggleClienteSection);
    });
}

/**
 * Renderizar seção de cliente
 */
function renderizarClienteSection(dados) {
    const { cliente, orcamentos, totalCliente } = dados;
    const clienteNome = cliente.nome || cliente.email || 'Cliente Desconhecido';
    const clienteCNPJ = cliente.cnpj || 'N/A';
    const clienteEmail = cliente.email || 'N/A';
    
    let html = `
        <div class="cliente-section">
            <div class="cliente-header">
                <div>
                    <h3>${clienteNome}</h3>
                    <div class="cliente-info">
                        📧 ${clienteEmail} | 🏢 ${clienteCNPJ} | 📊 ${orcamentos.length} orçamento(s)
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="color: #20c997; font-weight: 600; font-size: 16px;">
                        ${formatarMoeda(totalCliente)}
                    </div>
                    <div class="toggle-icon">▼</div>
                </div>
            </div>
            
            <div class="cliente-orcamentos">
    `;
    
    // Listar orçamentos do cliente
    orcamentos.forEach(orc => {
        const dataFormatada = formatarData(orc.data);
        const itensHTML = (orc.itens || []).map(item => `
            <tr>
                <td class="item-codigo">${item.codigo || 'N/A'}</td>
                <td class="item-descricao">${item.descricao || 'Sem descrição'}</td>
                <td style="text-align: center; color: #666;">${item.qtd || 1}</td>
                <td class="item-valor">${formatarMoeda(item.valor || 0)}</td>
                <td class="item-valor">${formatarMoeda((item.valor || 0) * (item.qtd || 1))}</td>
            </tr>
        `).join('');
        
        const totalOrcamento = (orc.itens || []).reduce((sum, item) => 
            sum + ((item.valor || 0) * (item.qtd || 1)), 0
        );
        
        html += `
            <div class="orcamento-item">
                <div class="orcamento-meta">
                    <div>
                        <div class="orcamento-id">#${orc.id}</div>
                        <div class="orcamento-data">📅 ${dataFormatada}</div>
                    </div>
                    <div class="orcamento-valor">${formatarMoeda(totalOrcamento)}</div>
                </div>
                
                ${orc.itens && orc.itens.length > 0 ? `
                    <table class="orcamento-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Qtd</th>
                                <th>V. Unit.</th>
                                <th>V. Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itensHTML}
                        </tbody>
                    </table>
                ` : '<p style="color: #999; margin: 10px 0;">Sem itens</p>'}
                
                ${orc.observacao ? `
                    <div class="orcamento-obs">
                        <strong>📝 Observação:</strong> ${orc.observacao}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

/**
 * Agrupar orçamentos por cliente
 */
function agruparPorCliente(orcamentos) {
    const agrupado = {};
    
    orcamentos.forEach(orc => {
        const clienteId = orc.clienteId || 'desconhecido';
        
        if (!agrupado[clienteId]) {
            agrupado[clienteId] = {
                cliente: {
                    id: clienteId,
                    nome: orc.clienteNome || '',
                    email: orc.clienteEmail || '',
                    cnpj: orc.clienteCNPJ || ''
                },
                orcamentos: [],
                totalCliente: 0
            };
        }
        
        // Calcular total do orçamento
        const totalOrcamento = (orc.itens || []).reduce((sum, item) => 
            sum + ((item.valor || 0) * (item.qtd || 1)), 0
        );
        
        agrupado[clienteId].orcamentos.push(orc);
        agrupado[clienteId].totalCliente += totalOrcamento;
    });
    
    // Ordenar clientes por valor total (descendente)
    const ordenado = Object.entries(agrupado)
        .sort((a, b) => b[1].totalCliente - a[1].totalCliente)
        .reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj;
        }, {});
    
    return ordenado;
}

/**
 * Calcular estatísticas
 */
function calcularEstatisticas(orcamentos) {
    let totalClientes = 0;
    let totalOrcamentos = orcamentos.length;
    let valorTotal = 0;
    const clientesUnicos = new Set();
    
    orcamentos.forEach(orc => {
        clientesUnicos.add(orc.clienteId || orc.clienteEmail);
        
        const totalOrcamento = (orc.itens || []).reduce((sum, item) => 
            sum + ((item.valor || 0) * (item.qtd || 1)), 0
        );
        
        valorTotal += totalOrcamento;
    });
    
    totalClientes = clientesUnicos.size;
    
    return {
        totalClientes,
        totalOrcamentos,
        valorTotal,
        ticketMedio: totalOrcamentos > 0 ? valorTotal / totalOrcamentos : 0
    };
}

/**
 * Alternar expansão/colapso de seção de cliente
 */
function toggleClienteSection(e) {
    if (e.target.closest('input, button, a')) return;
    
    const header = e.currentTarget;
    const section = header.nextElementSibling;
    
    header.classList.toggle('collapsed');
    section.classList.toggle('hidden');
}

/**
 * Filtrar orçamentos
 */
function filtrarOrcamentos() {
    const filtro = document.getElementById('filtro-cliente').value.toLowerCase();
    filtroAtual = filtro;
    
    if (!filtro) {
        renderizarPainel();
        return;
    }
    
    // Filtrar orçamentos
    const orcamentosFiltrados = orcamentosGlobal.filter(orc => {
        const nome = (orc.clienteNome || '').toLowerCase();
        const email = (orc.clienteEmail || '').toLowerCase();
        const cnpj = (orc.clienteCNPJ || '').toLowerCase();
        
        return nome.includes(filtro) || email.includes(filtro) || cnpj.includes(filtro);
    });
    
    // Renderizar só os filtrados
    const orcamentosPorCliente = agruparPorCliente(orcamentosFiltrados);
    
    let html = `
        <div class="filtros">
            <input 
                type="text" 
                id="filtro-cliente" 
                placeholder="🔍 Filtrar por cliente, email ou CNPJ..."
                value="${filtro}"
                onkeyup="filtrarOrcamentos()">
            <button onclick="limparFiltro()">Limpar</button>
        </div>
    `;
    
    if (Object.keys(orcamentosPorCliente).length === 0) {
        html += `
            <div class="empty-state">
                <h3>Nenhum orçamento encontrado</h3>
                <p>Nenhum cliente ou orçamento corresponde a "${filtro}"</p>
            </div>
        `;
    } else {
        for (const [clienteId, dados] of Object.entries(orcamentosPorCliente)) {
            html += renderizarClienteSection(dados);
        }
    }
    
    document.getElementById('admin-content').innerHTML = html;
    
    // Adicionar event listeners
    document.querySelectorAll('.cliente-header').forEach(header => {
        header.addEventListener('click', toggleClienteSection);
    });
}

/**
 * Limpar filtro
 */
function limparFiltro() {
    document.getElementById('filtro-cliente').value = '';
    filtroAtual = '';
    renderizarPainel();
}

/**
 * Confirmar deleção de orçamento com dialog
 */
function confirmarDeletarOrcamento(orcamentoId) {
    if (confirm('⚠️ Tem certeza que deseja deletar este orçamento? Esta ação não pode ser desfeita.')) {
        executarDeletarOrcamento(orcamentoId);
    }
}

/**
 * Executar deleção do orçamento
 */
async function executarDeletarOrcamento(orcamentoId) {
    try {
        const resultado = await deletarOrcamento(orcamentoId);
        if (resultado) {
            // Remover do array global
            orcamentosGlobal = orcamentosGlobal.filter(o => o.id !== orcamentoId);
            
            // Se estamos na visualização de detalhes do cliente, recarregar
            const contenido = document.getElementById('admin-content').innerHTML;
            if (contenido.includes('Orçamentos do Cliente')) {
                // Pegar o primeiro cliente disponível para recarregar
                if (clientesGlobal.length > 0) {
                    abrirDetalheCliente(clientesGlobal[0].id);
                } else {
                    mostrarAba('clientes');
                }
            }
            
            alert('✅ Orçamento deletado com sucesso!');
        }
    } catch (erro) {
        console.error('Erro ao deletar orçamento:', erro);
        alert('❌ Erro ao deletar orçamento');
    }
}

/**
 * Confirmar deleção de cliente com dialog
 */
function confirmarDeletarCliente(clienteId) {
    const cliente = clientesGlobal.find(c => c.id === clienteId);
    const nomeCliente = cliente?.razaoSocial || cliente?.fantasia || 'Cliente';
    
    if (confirm(`⚠️ ATENÇÃO: Você está deletando o cliente "${nomeCliente}". Todos os seus orçamentos também serão deletados. Esta ação não pode ser desfeita.\n\nDeseja continuar?`)) {
        executarDeletarCliente(clienteId);
    }
}

/**
 * Executar deleção do cliente
 */
async function executarDeletarCliente(clienteId) {
    try {
        const resultado = await deletarCliente(clienteId);
        if (resultado) {
            // Remover do array global
            clientesGlobal = clientesGlobal.filter(c => c.id !== clienteId);
            orcamentosGlobal = orcamentosGlobal.filter(o => o.clienteId !== clienteId);
            
            // Voltar para a aba de clientes e recarregar
            mostrarAba('clientes');
            
            alert('✅ Cliente e seus orçamentos deletados com sucesso!');
        }
    } catch (erro) {
        console.error('Erro ao deletar cliente:', erro);
        alert('❌ Erro ao deletar cliente');
    }
}

/**
 * Exportar orçamento como PDF
 */
function exportarOrcamentoPDF(orcamentoId) {
    const orcamento = orcamentosGlobal.find(o => o.id === orcamentoId);
    if (!orcamento) {
        alert('Orçamento não encontrado');
        return;
    }

    const cliente = clientesGlobal.find(c => c.id === orcamento.clienteId);
    if (!cliente) {
        alert('Cliente não encontrado');
        return;
    }

    if (!window.jspdf?.jsPDF) {
        alert('jsPDF não disponível. Tente novamente.');
        return;
    }

    try {
        const doc = new window.jspdf.jsPDF();

        const marginLeft = 14;
        const marginRight = 14;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const colDesc = 70;
        const colQtd = 140;
        const colValor = 160;
        let y = 18;

        // Cabeçalho
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Orçamento", pageWidth / 2, 12, { align: "center" });
        y += 8;

        // Dados do cliente
        doc.setFontSize(10);
        doc.setFont("courier", "normal");
        
        doc.text(`Cliente: ${cliente.razaoSocial || cliente.fantasia || 'N/A'}`, marginLeft, y);
        y += 5;
        
        if (cliente.cnpj || cliente.cpf) {
            const documento = cliente.cnpj || cliente.cpf || '';
            const labelDoc = cliente.cnpj ? 'CNPJ' : 'CPF';
            doc.text(`${labelDoc}: ${documento}`, marginLeft, y);
            y += 5;
        }
        
        if (cliente.email) {
            doc.text(`E-mail: ${cliente.email}`, marginLeft, y);
            y += 5;
        }
        
        if (cliente.telefone) {
            doc.text(`Telefone: ${cliente.telefone}`, marginLeft, y);
            y += 5;
        }
        
        y += 3;

        // Data do orçamento
        const dataFormatada = new Date(orcamento.data).toLocaleDateString('pt-BR');
        doc.setFont("courier", "italic");
        doc.setFontSize(9);
        doc.text(`Gerado em: ${dataFormatada}`, marginLeft, y);
        y += 6;

        // Tabela de itens
        if (orcamento.itens && orcamento.itens.length > 0) {
            doc.setFontSize(10);
            doc.setFont("courier", "bold");
            doc.text("Código", marginLeft, y);
            doc.text("Descrição", colDesc, y);
            doc.text("Qtd", colQtd, y);
            doc.text("V. Unit.", colValor, y);
            y += 6;

            doc.setFont("courier", "normal");
            doc.setFontSize(9);

            const descColWidth = colQtd - colDesc - 6;
            const lineHeight = 4;

            // Iterar sobre os itens
            let totalOrcamento = 0;
            orcamento.itens.forEach((item, index) => {
                const descricao = (item.descricao || "").replace(/\s+/g, " ").trim();
                const codigo = item.codigo || "";
                const qtd = Number(item.qtd) || 1;
                const valor = Number(item.valor) || 0;
                const totalItem = valor * qtd;

                totalOrcamento += totalItem;

                const descLines = doc.splitTextToSize(descricao, descColWidth);
                
                // Verificar se precisa de nova página
                if (y + descLines.length * lineHeight > pageHeight - 20) {
                    doc.addPage();
                    y = 18;
                }

                doc.text(codigo, marginLeft, y);
                doc.text(descLines, colDesc, y);
                doc.text(String(qtd), colQtd, y);
                doc.text(formatarMoeda(valor), colValor, y);

                y += descLines.length * lineHeight + 1;
            });

            // Linha separadora
            y += 2;
            doc.setDrawColor(200);
            doc.line(marginLeft, y, pageWidth - marginRight, y);
            y += 3;

            // Total
            doc.setFont("courier", "bold");
            doc.setFontSize(12);
            doc.text("TOTAL:", colDesc, y);
            doc.text(formatarMoeda(totalOrcamento), colValor, y);
        }

        // Observações
        if (orcamento.observacao) {
            y += 10;
            if (y > pageHeight - 30) {
                doc.addPage();
                y = 18;
            }
            
            doc.setFont("courier", "bold");
            doc.setFontSize(10);
            doc.text("Observações:", marginLeft, y);
            y += 5;
            
            doc.setFont("courier", "normal");
            doc.setFontSize(9);
            const obsLines = doc.splitTextToSize(orcamento.observacao, pageWidth - marginLeft - marginRight);
            doc.text(obsLines, marginLeft, y);
        }

        // Nome do arquivo
        const dataObj = new Date(orcamento.data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = String(dataObj.getFullYear()).slice(-2);
        const nomeArquivo = `Orcamento-${dia}-${mes}-${ano}.pdf`;
        
        doc.save(nomeArquivo);
        alert('✅ PDF exportado com sucesso!');

    } catch (erro) {
        console.error('Erro ao gerar PDF:', erro);
        alert('❌ Erro ao gerar PDF');
    }
}

/**
 * Exportar orçamento como CSV
 */
function exportarOrcamentoCSV(orcamentoId) {
    const orcamento = orcamentosGlobal.find(o => o.id === orcamentoId);
    if (!orcamento) {
        alert('Orçamento não encontrado');
        return;
    }

    const cliente = clientesGlobal.find(c => c.id === orcamento.clienteId);
    if (!cliente) {
        alert('Cliente não encontrado');
        return;
    }

    try {
        let csv = 'ORÇAMENTO\n\n';
        
        // Dados do cliente
        csv += `Cliente,${cliente.razaoSocial || cliente.fantasia || 'N/A'}\n`;
        
        const documento = cliente.cnpj || cliente.cpf || '';
        const labelDoc = cliente.cnpj ? 'CNPJ' : 'CPF';
        if (documento) {
            csv += `${labelDoc},${documento}\n`;
        }
        
        if (cliente.email) {
            csv += `Email,${cliente.email}\n`;
        }
        
        if (cliente.telefone) {
            csv += `Telefone,${cliente.telefone}\n`;
        }

        const dataFormatada = new Date(orcamento.data).toLocaleDateString('pt-BR');
        csv += `Data,${dataFormatada}\n`;
        csv += '\nITENS\n';
        csv += 'Código,Descrição,Quantidade,Valor Unitário,Valor Total\n';

        let totalOrcamento = 0;
        if (orcamento.itens && orcamento.itens.length > 0) {
            orcamento.itens.forEach(item => {
                const descricao = (item.descricao || "").replace(/,/g, ";");
                const qtd = Number(item.qtd) || 1;
                const valor = Number(item.valor) || 0;
                const totalItem = valor * qtd;

                totalOrcamento += totalItem;

                csv += `${item.codigo || ''},${descricao},${qtd},"R$ ${valor.toFixed(2)}","R$ ${totalItem.toFixed(2)}"\n`;
            });
        }

        csv += `\n,,,TOTAL,"R$ ${totalOrcamento.toFixed(2)}"\n`;

        if (orcamento.observacao) {
            csv += `\nObservações,${orcamento.observacao.replace(/,/g, ";")}\n`;
        }

        // Baixar CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const dataObj = new Date(orcamento.data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = String(dataObj.getFullYear()).slice(-2);
        const nomeArquivo = `Orcamento-${dia}-${mes}-${ano}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', nomeArquivo);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('✅ CSV exportado com sucesso!');

    } catch (erro) {
        console.error('Erro ao exportar CSV:', erro);
        alert('❌ Erro ao exportar CSV');
    }
}

/**
 * Abrir modal para trocar senha do admin
 */
function abrirModalTrocarSenha() {
    document.getElementById('modal-trocar-senha').style.display = 'block';
}

/**
 * Fechar modal de trocar senha
 */
function fecharModalTrocarSenha() {
    document.getElementById('modal-trocar-senha').style.display = 'none';
    document.getElementById('form-trocar-senha-admin').reset();
}

/**
 * Handler para formulário de trocar senha do admin
 */
document.getElementById('form-trocar-senha-admin')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const senhaAtual = document.getElementById('admin-senha-atual').value;
    const novaSenha = document.getElementById('admin-nova-senha').value;
    const confirmarSenha = document.getElementById('admin-confirmar-senha').value;
    
    // Validações
    if (!senhaAtual) {
        alert('❌ Preencha a senha atual');
        return;
    }
    
    if (novaSenha.length < 6) {
        alert('❌ A nova senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    if (!/[a-zA-Z]/.test(novaSenha)) {
        alert('❌ A nova senha deve conter letras');
        return;
    }
    
    if (!/[0-9]/.test(novaSenha)) {
        alert('❌ A nova senha deve conter números');
        return;
    }
    
    if (novaSenha !== confirmarSenha) {
        alert('❌ As senhas não conferem');
        return;
    }
    
    // Chamar função de trocar senha
    const resultado = await trocarSenha(senhaAtual, novaSenha);
    
    if (resultado) {
        alert('✅ Senha alterada com sucesso!');
        fecharModalTrocarSenha();
    }
});

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarAdmin);
