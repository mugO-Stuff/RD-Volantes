/**
 * ÁREA DO CLIENTE - RD Volantes
 * Gerenciamento de perfil e histórico de orçamentos
 */

// Verificar se está logado
const usuario = usuarioLogado();
if (!usuario) {
    window.location.href = 'login.html';
}

// ==================================
// MÁSCARAS DE FORMATAÇÃO
// ==================================

function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraCNPJ(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, '');
    if (valor.length <= 10) {
        return valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

function mascaraCEP(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

// ==================================
// TOGGLE PESSOA FÍSICA / JURÍDICA
// ==================================

function toggleTipoPessoa() {
    const tipoPessoa = document.getElementById('editar-tipo-pessoa').value;
    const camposPF = document.querySelectorAll('.campos-pf');
    const camposPJ = document.querySelectorAll('.campos-pj');
    
    if (tipoPessoa === 'fisica') {
        camposPF.forEach(el => el.style.display = 'block');
        camposPJ.forEach(el => el.style.display = 'none');
    } else if (tipoPessoa === 'juridica') {
        camposPF.forEach(el => el.style.display = 'none');
        camposPJ.forEach(el => el.style.display = 'block');
    } else {
        camposPF.forEach(el => el.style.display = 'none');
        camposPJ.forEach(el => el.style.display = 'none');
    }
    
    // Recalcular preenchimento quando tipo de pessoa mudar
    calcularPreenchimentoPerfil();
}

// Listener para mudança de tipo de pessoa
document.getElementById('editar-tipo-pessoa')?.addEventListener('change', toggleTipoPessoa);

// ==================================
// APLICAR MÁSCARAS NOS INPUTS
// ==================================

document.getElementById('editar-cpf')?.addEventListener('input', (e) => {
    e.target.value = mascaraCPF(e.target.value);
    calcularPreenchimentoPerfil();
});

document.getElementById('editar-cnpj')?.addEventListener('input', (e) => {
    e.target.value = mascaraCNPJ(e.target.value);
    calcularPreenchimentoPerfil();
});

document.getElementById('editar-telefone')?.addEventListener('input', (e) => {
    e.target.value = mascaraTelefone(e.target.value);
    calcularPreenchimentoPerfil();
});

document.getElementById('editar-cep')?.addEventListener('input', (e) => {
    e.target.value = mascaraCEP(e.target.value);
    calcularPreenchimentoPerfil();
});

document.getElementById('editar-transp-cep')?.addEventListener('input', (e) => {
    e.target.value = mascaraCEP(e.target.value);
    calcularPreenchimentoPerfil();
});

// ==================================
// CÁLCULO DE PREENCHIMENTO DO PERFIL
// ==================================

function calcularPreenchimentoPerfil() {
    // Campos obrigatórios
    const camposObrigatorios = [
        { id: 'editar-nome', tipo: 'text' },
        { id: 'editar-tipo-pessoa', tipo: 'select' },
        { id: 'editar-telefone', tipo: 'text' }
    ];
    
    // Campos condicionais (Pessoa Física)
    const camposPF = [
        { id: 'editar-cpf', tipo: 'text' }
    ];
    
    // Campos condicionais (Pessoa Jurídica)
    const camposPJ = [
        { id: 'editar-cnpj', tipo: 'text' },
        { id: 'editar-regime-tributario', tipo: 'select' }
    ];
    
    // Campos de endereço
    const camposEndereco = [
        { id: 'editar-cep', tipo: 'text' },
        { id: 'editar-uf', tipo: 'select' },
        { id: 'editar-cidade', tipo: 'text' },
        { id: 'editar-endereco', tipo: 'text' },
        { id: 'editar-numero', tipo: 'text' }
    ];
    
    // Campos de transportadora (só obrigatórios se "Entrega Direta" não estiver marcado)
    const camposTransportadora = [
        { id: 'editar-transp-cep', tipo: 'text' },
        { id: 'editar-transp-uf', tipo: 'select' },
        { id: 'editar-transp-cidade', tipo: 'text' },
        { id: 'editar-transp-endereco', tipo: 'text' },
        { id: 'editar-transp-numero', tipo: 'text' }
    ];
    
    // Verificar tipo de pessoa
    const tipoPessoa = document.getElementById('editar-tipo-pessoa')?.value || '';
    
    // Verificar entrega direta
    const entregaDireta = document.getElementById('editar-entrega-direta')?.checked || false;
    
    // Calcular campos preenchidos
    let preenchidos = 0;
    let total = 0;
    
    // Contar obrigatórios
    camposObrigatorios.forEach(campo => {
        total++;
        const elem = document.getElementById(campo.id);
        if (elem && elem.value && elem.value.trim()) {
            preenchidos++;
        }
    });
    
    // Contar condicionais por tipo de pessoa
    if (tipoPessoa === 'fisica') {
        camposPF.forEach(campo => {
            total++;
            const elem = document.getElementById(campo.id);
            if (elem && elem.value && elem.value.trim()) {
                preenchidos++;
            }
        });
    } else if (tipoPessoa === 'juridica') {
        camposPJ.forEach(campo => {
            total++;
            const elem = document.getElementById(campo.id);
            if (elem && elem.value && elem.value.trim()) {
                preenchidos++;
            }
        });
    }
    
    // Contar endereço
    camposEndereco.forEach(campo => {
        total++;
        const elem = document.getElementById(campo.id);
        if (elem && elem.value && elem.value.trim()) {
            preenchidos++;
        }
    });
    
    // Contar transportadora (se não for entrega direta)
    if (!entregaDireta) {
        camposTransportadora.forEach(campo => {
            total++;
            const elem = document.getElementById(campo.id);
            if (elem && elem.value && elem.value.trim()) {
                preenchidos++;
            }
        });
    }
    
    // Calcular porcentagem
    const porcentagem = total > 0 ? Math.round((preenchidos / total) * 100) : 0;
    
    // Atualizar visual
    const barraElem = document.getElementById('perfil-barra');
    const porcentagemElem = document.getElementById('perfil-porcentagem');
    
    if (barraElem) {
        barraElem.style.width = porcentagem + '%';
    }
    if (porcentagemElem) {
        porcentagemElem.textContent = porcentagem + '%';
    }
    
    return porcentagem;
}

// ==================================
// TOGGLE ENTREGA DIRETA
// ==================================

function toggleEntregaDireta() {
    const secaoTransportadora = document.getElementById('secao-transportadora');
    const entregaDireta = document.getElementById('editar-entrega-direta')?.checked || false;
    
    if (secaoTransportadora) {
        if (entregaDireta) {
            secaoTransportadora.style.display = 'none';
            // Limpar campos de transportadora
            document.getElementById('editar-transp-cep').value = '';
            document.getElementById('editar-transp-uf').value = '';
            document.getElementById('editar-transp-cidade').value = '';
            document.getElementById('editar-transp-bairro').value = '';
            document.getElementById('editar-transp-endereco').value = '';
            document.getElementById('editar-transp-numero').value = '';
            document.getElementById('editar-transp-complemento').value = '';
        } else {
            secaoTransportadora.style.display = 'block';
        }
    }
    
    // Recalcular preenchimento
    calcularPreenchimentoPerfil();
}

// Listener para checkbox de Entrega Direta
document.getElementById('editar-entrega-direta')?.addEventListener('change', toggleEntregaDireta);

// Listeners para recalcular preenchimento em tempo real
// (Nota: CPF, CNPJ, Telefone, CEP e Transp-CEP já têm listeners mas chamam calcularPreenchimentoPerfil(),
// então estes são para os outros campos que não têm máscaras)
const camposParaMonitorar = [
    'editar-nome', // Razão Social
    'editar-regime-tributario',
    'editar-uf',
    'editar-cidade',
    'editar-endereco',
    'editar-numero',
    'editar-transp-uf',
    'editar-transp-cidade',
    'editar-transp-endereco',
    'editar-transp-numero'
];

camposParaMonitorar.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) {
        campo.addEventListener('input', calcularPreenchimentoPerfil);
    }
});

// ==================================
// CARREGAR PERFIL
// ==================================

// Carregar dados do perfil
function carregarPerfil() {
    const usuario = usuarioLogado();
    if (!usuario) return;
    
    // Atualizar cabeçalho do perfil
    const nomeExibir = usuario.nome || 'Cliente RD Volantes';
    document.getElementById('perfil-nome').textContent = nomeExibir;
    document.getElementById('perfil-email').textContent = `📧 ${usuario.email}`;
    
    if (usuario.telefone) {
        document.getElementById('perfil-telefone').textContent = `📱 ${usuario.telefone}`;
        document.getElementById('perfil-telefone').style.display = 'block';
    }
    
    if (usuario.cnpj) {
        document.getElementById('perfil-cnpj').textContent = `🏢 ${usuario.cnpj}`;
        document.getElementById('perfil-cnpj').style.display = 'block';
    }
    
    // Preencher formulário de edição
    document.getElementById('editar-email').value = usuario.email || '';
    document.getElementById('editar-nome').value = usuario.nome || '';
    document.getElementById('editar-fantasia').value = usuario.fantasia || '';
    document.getElementById('editar-tipo-pessoa').value = usuario.tipoPessoa || '';
    
    // Pessoa Física
    document.getElementById('editar-cpf').value = usuario.cpf || '';
    document.getElementById('editar-rg').value = usuario.rg || '';
    document.getElementById('editar-orgao-emissor').value = usuario.orgaoEmissor || '';
    document.getElementById('editar-inscricao-estadual-pf').value = usuario.inscricaoEstadualPF || '';
    
    // Pessoa Jurídica
    document.getElementById('editar-cnpj').value = usuario.cnpj || '';
    document.getElementById('editar-regime-tributario').value = usuario.regimeTributario || '';
    document.getElementById('editar-inscricao-estadual').value = usuario.inscricaoEstadual || '';
    document.getElementById('editar-inscricao-municipal').value = usuario.inscricaoMunicipal || '';
    document.getElementById('editar-ie-isento').value = usuario.ieIsento || 'nao';
    
    // Campos comuns
    document.getElementById('editar-cliente-desde').value = usuario.clienteDesde || '';
    document.getElementById('editar-contribuinte').value = usuario.contribuinte || '';
    document.getElementById('editar-telefone').value = usuario.telefone || '';
    
    // Endereço
    document.getElementById('editar-cep').value = usuario.cep || '';
    document.getElementById('editar-uf').value = usuario.uf || '';
    document.getElementById('editar-cidade').value = usuario.cidade || '';
    document.getElementById('editar-bairro').value = usuario.bairro || '';
    document.getElementById('editar-endereco').value = usuario.endereco || '';
    document.getElementById('editar-numero').value = usuario.numero || '';
    document.getElementById('editar-complemento').value = usuario.complemento || '';
    
    // Endereço da Transportadora
    document.getElementById('editar-transp-cep').value = usuario.transpCep || '';
    document.getElementById('editar-transp-uf').value = usuario.transpUf || '';
    document.getElementById('editar-transp-cidade').value = usuario.transpCidade || '';
    document.getElementById('editar-transp-bairro').value = usuario.transpBairro || '';
    document.getElementById('editar-transp-endereco').value = usuario.transpEndereco || '';
    document.getElementById('editar-transp-numero').value = usuario.transpNumero || '';
    document.getElementById('editar-transp-complemento').value = usuario.transpComplemento || '';
    
    // Aplicar toggle inicial
    toggleTipoPessoa();
}

// Carregar orçamentos
async function carregarOrcamentos() {
    const loadingDiv = document.getElementById('orcamentos-loading');
    const containerDiv = document.getElementById('orcamentos-container');
    const emptyDiv = document.getElementById('orcamentos-empty');
    const listaDiv = document.getElementById('orcamentos-lista');
    
    loadingDiv.style.display = 'block';
    containerDiv.style.display = 'none';
    emptyDiv.style.display = 'none';
    
    try {
        const resultado = await buscarOrcamentos();
        
        if (resultado.sucesso && resultado.orcamentos && resultado.orcamentos.length > 0) {
            // Renderizar orçamentos
            listaDiv.innerHTML = '';
            
            resultado.orcamentos.forEach(orcamento => {
                const card = criarCardOrcamento(orcamento);
                listaDiv.appendChild(card);
            });
            
            loadingDiv.style.display = 'none';
            containerDiv.style.display = 'block';
        } else {
            // Nenhum orçamento
            loadingDiv.style.display = 'none';
            emptyDiv.style.display = 'block';
        }
    } catch (erro) {
        console.error('Erro ao carregar orçamentos:', erro);
        loadingDiv.innerHTML = '<p style="color: #d84040;">Erro ao carregar orçamentos. Tente novamente mais tarde.</p>';
    }
}

// Criar card de orçamento
function criarCardOrcamento(orcamento) {
    const card = document.createElement('div');
    card.className = 'orcamento-card';
    
    // Formatar data
    const data = new Date(orcamento.data);
    const dataFormatada = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Status
    const status = orcamento.status || 'Pendente';
    let statusClass = 'status-pendente';
    if (status.toLowerCase().includes('aprovado')) statusClass = 'status-aprovado';
    if (status.toLowerCase().includes('enviado')) statusClass = 'status-enviado';
    
    // Itens (primeiros 5)
    const itens = orcamento.itens || [];
    const itensHTML = itens.slice(0, 5).map(item => `
        <div class="item-row">
            <span class="item-codigo">${item.codigo || 'N/A'}</span>
            <span class="item-descricao">${item.descricao || 'Sem descrição'}</span>
            <span class="item-qtd">Qtd: ${item.qtd || 1}</span>
        </div>
    `).join('');
    
    const maisItens = itens.length > 5 ? `<p style="text-align: center; color: #888; font-size: 12px; margin-top: 8px;">+ ${itens.length - 5} itens</p>` : '';
    
    // Calcular total (sem mostrar valores para clientes)
    const totalItens = itens.length;
    
    card.innerHTML = `
        <div class="orcamento-header">
            <div>
                <div class="orcamento-id">#${orcamento.id}</div>
                <div class="orcamento-data">${dataFormatada}</div>
            </div>
            <span class="orcamento-status ${statusClass}">${status}</span>
        </div>
        
        <div class="orcamento-info">
            <div class="info-item">
                <span class="info-label">Total de Itens</span>
                <span class="info-value">${orcamento.totalItens || totalItens}</span>
            </div>
            ${orcamento.observacao ? `
            <div class="info-item">
                <span class="info-label">Observação</span>
                <span class="info-value" style="font-size: 14px; font-weight: normal;">${orcamento.observacao}</span>
            </div>
            ` : ''}
        </div>
        
        ${itens.length > 0 ? `
        <div class="orcamento-itens">
            <h4>Itens do Orçamento</h4>
            <div class="item-lista">
                ${itensHTML}
                ${maisItens}
            </div>
        </div>
        ` : ''}
        
        <div class="orcamento-acoes">
            <button class="btn-acao btn-repetir" onclick="repetirOrcamento('${orcamento.id}')">
                🔄 Repetir Orçamento
            </button>
        </div>
    `;
    
    return card;
}

// Repetir orçamento (adicionar itens ao carrinho)
function repetirOrcamento(orcamentoId) {
    // Buscar orçamento
    buscarOrcamentos().then(resultado => {
        if (!resultado.sucesso) return;
        
        const orcamento = resultado.orcamentos.find(o => o.id === orcamentoId);
        if (!orcamento || !orcamento.itens) return;
        
        // Adicionar todos os itens ao carrinho
        const carrinho = safeGetCarrinho ? safeGetCarrinho() : [];
        
        orcamento.itens.forEach(item => {
            // Verificar se item já existe no carrinho
            const existente = carrinho.find(c => c.codigo === item.codigo);
            if (existente) {
                existente.qtd = (existente.qtd || 1) + (item.qtd || 1);
            } else {
                carrinho.push({
                    codigo: item.codigo,
                    descricao: item.descricao,
                    qtd: item.qtd || 1,
                    preco: item.preco || 0
                });
            }
        });
        
        // Salvar carrinho
        if (typeof safeSaveCarrinho === 'function') {
            safeSaveCarrinho(carrinho);
        } else {
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
        }
        
        // Redirecionar para carrinho
        alert('✅ Itens adicionados ao carrinho!');
        window.location.href = 'carrinho.html';
    }).catch(erro => {
        console.error('Erro ao repetir orçamento:', erro);
        alert('Erro ao repetir orçamento. Tente novamente.');
    });
}

// Salvar alterações do perfil
document.getElementById('form-perfil')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Coletar todos os dados do formulário
    const dadosCompletos = {
        nome: document.getElementById('editar-nome').value.trim(),
        fantasia: document.getElementById('editar-fantasia').value.trim(),
        tipoPessoa: document.getElementById('editar-tipo-pessoa').value,
        
        // Pessoa Física
        cpf: document.getElementById('editar-cpf').value.trim(),
        rg: document.getElementById('editar-rg').value.trim(),
        orgaoEmissor: document.getElementById('editar-orgao-emissor').value.trim(),
        inscricaoEstadualPF: document.getElementById('editar-inscricao-estadual-pf').value.trim(),
        
        // Pessoa Jurídica
        cnpj: document.getElementById('editar-cnpj').value.trim(),
        regimeTributario: document.getElementById('editar-regime-tributario').value,
        inscricaoEstadual: document.getElementById('editar-inscricao-estadual').value.trim(),
        inscricaoMunicipal: document.getElementById('editar-inscricao-municipal').value.trim(),
        ieIsento: document.getElementById('editar-ie-isento').value,
        
        // Campos comuns
        clienteDesde: document.getElementById('editar-cliente-desde').value,
        contribuinte: document.getElementById('editar-contribuinte').value,
        telefone: document.getElementById('editar-telefone').value.trim(),
        
        // Endereço
        cep: document.getElementById('editar-cep').value.trim(),
        uf: document.getElementById('editar-uf').value,
        cidade: document.getElementById('editar-cidade').value.trim(),
        bairro: document.getElementById('editar-bairro').value.trim(),
        endereco: document.getElementById('editar-endereco').value.trim(),
        numero: document.getElementById('editar-numero').value.trim(),
        complemento: document.getElementById('editar-complemento').value.trim(),
        
        // Endereço da Transportadora
        transpCep: document.getElementById('editar-transp-cep').value.trim(),
        transpUf: document.getElementById('editar-transp-uf').value,
        transpCidade: document.getElementById('editar-transp-cidade').value.trim(),
        transpBairro: document.getElementById('editar-transp-bairro').value.trim(),
        transpEndereco: document.getElementById('editar-transp-endereco').value.trim(),
        transpNumero: document.getElementById('editar-transp-numero').value.trim(),
        transpComplemento: document.getElementById('editar-transp-complemento').value.trim()
    };
    
    // Validação básica
    if (!dadosCompletos.nome) {
        alert('❌ O nome é obrigatório!');
        return;
    }
    
    if (!dadosCompletos.tipoPessoa) {
        alert('❌ Selecione o tipo de pessoa!');
        return;
    }
    
    const btnSalvar = e.target.querySelector('.btn-salvar');
    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Salvando...';
    
    try {
        const resultado = await atualizarDadosCliente(dadosCompletos);
        
        if (resultado.sucesso) {
            alert('✅ Dados atualizados com sucesso!');
            carregarPerfil();
        } else {
            alert('❌ ' + resultado.mensagem);
        }
    } catch (erro) {
        console.error('Erro ao salvar:', erro);
        alert('❌ Erro ao salvar alterações. Tente novamente.');
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = 'Salvar Alterações';
    }
});

// Sistema de tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Remover active de todas as tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Adicionar active na tab clicada
        tab.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});

// Botão editar perfil (muda para tab de perfil)
document.getElementById('btn-editar')?.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector('[data-tab="perfil"]').classList.add('active');
    document.getElementById('tab-perfil').classList.add('active');
});

// Handler para trocar senha
document.getElementById('form-trocar-senha')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const senhaAtual = document.getElementById('senha-atual').value;
    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    
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
        // Limpar formulário
        document.getElementById('form-trocar-senha').reset();
    }
});

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    carregarOrcamentos();
});
