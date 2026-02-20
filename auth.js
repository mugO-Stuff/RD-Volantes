/**
 * SISTEMA DE AUTENTICAÇÃO - RD Volantes
 * 
 * Gerencia login, cadastro e sessão do usuário
 * Integrado com Google Sheets via Apps Script
 */

// URL do Google Apps Script (CONFIGURAR APÓS DEPLOY)
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvzADqnGA_RqZhfjhrKdicsHytf8LTZrGGtwS_a4vbZ1Z15NEqczo7KnV50wTJwmuL/exec';

// Chaves do localStorage
const STORAGE_KEYS = {
    USUARIO: 'rd_usuario',
    SESSION_TOKEN: 'rd_session_token',
    SESSION_EXPIRY: 'rd_session_expiry'
};

// Duração da sessão: 7 dias
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Hash SHA-256 (para senhas)
 */
async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Verificar se usuário está logado
 */
function usuarioLogado() {
    try {
        const sessionToken = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
        const sessionExpiry = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
        const usuario = localStorage.getItem(STORAGE_KEYS.USUARIO);
        
        if (!sessionToken || !sessionExpiry || !usuario) {
            return null;
        }
        
        // Verificar se sessão expirou
        if (Date.now() > parseInt(sessionExpiry)) {
            logout();
            return null;
        }
        
        return JSON.parse(usuario);
    } catch (erro) {
        console.error('Erro ao verificar usuário:', erro);
        return null;
    }
}

/**
 * Salvar sessão do usuário
 */
function salvarSessao(cliente) {
    try {
        const sessionToken = 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const sessionExpiry = Date.now() + SESSION_DURATION;
        
        localStorage.setItem(STORAGE_KEYS.USUARIO, JSON.stringify(cliente));
        localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
        localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, sessionExpiry.toString());
        
        return true;
    } catch (erro) {
        console.error('Erro ao salvar sessão:', erro);
        return false;
    }
}

/**
 * Fazer logout
 */
function logout() {
    localStorage.removeItem(STORAGE_KEYS.USUARIO);
    localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
}

/**
 * Validar senha forte (letras e números)
 */
function validarSenhaForte(senha) {
    if (!senha || senha.length < 6) {
        return { valido: false, mensagem: 'Senha deve ter no mínimo 6 caracteres' };
    }
    
    const temLetra = /[a-zA-Z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    
    if (!temLetra) {
        return { valido: false, mensagem: 'Senha deve conter pelo menos uma letra' };
    }
    
    if (!temNumero) {
        return { valido: false, mensagem: 'Senha deve conter pelo menos um número' };
    }
    
    return { valido: true, mensagem: 'Senha válida' };
}

/**
 * Cadastrar novo cliente
 */
async function cadastrarCliente(email, senha, nome, cnpj, telefone) {
    try {
        // Validações
        if (!email || !senha) {
            return { sucesso: false, mensagem: 'Email e senha são obrigatórios' };
        }
        
        // Validar senha forte
        const validacaoSenha = validarSenhaForte(senha);
        if (!validacaoSenha.valido) {
            return { sucesso: false, mensagem: validacaoSenha.mensagem };
        }
        
        // Hash da senha
        const senhaHash = await hashSenha(senha);
        
        // Enviar para Google Apps Script
        const resposta = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                acao: 'cadastrar',
                email: email,
                senhaHash: senhaHash,
                nome: nome,
                cnpj: cnpj,
                telefone: telefone
            })
        });
        
        // Como é no-cors, não conseguimos ler a resposta diretamente
        // Vamos tentar fazer login logo após para validar
        await new Promise(resolve => setTimeout(resolve, 1500)); // Aguarda 1.5s
        
        return await fazerLogin(email, senha);
        
    } catch (erro) {
        console.error('Erro ao cadastrar:', erro);
        return { sucesso: false, mensagem: 'Erro ao cadastrar: ' + erro.message };
    }
}

/**
 * Fazer login
 */
async function fazerLogin(email, senha) {
    try {
        // Validações
        if (!email || !senha) {
            return { sucesso: false, mensagem: 'Email e senha são obrigatórios' };
        }
        
        // Hash da senha
        const senhaHash = await hashSenha(senha);
        
        // Enviar para Google Apps Script usando GET com parâmetros
        const params = new URLSearchParams({
            acao: 'login',
            email: email,
            senhaHash: senhaHash
        });
        
        const resposta = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`, {
            method: 'GET',
            redirect: 'follow'
        });
        
        const dados = await resposta.json();
        
        if (dados.sucesso) {
            // Adicionar flag de admin se for o email de admin
            if (email === 'adm.rdvolantes@gmail.com') {
                dados.cliente.isAdmin = true;
            } else {
                dados.cliente.isAdmin = false;
            }
            salvarSessao(dados.cliente);
        }
        
        return dados;
        
    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        
        // Fallback: criar conta temporária local para testes
        if (GOOGLE_APPS_SCRIPT_URL.includes('COLE_SUA_URL_AQUI')) {
            console.warn('⚠️ Google Apps Script não configurado. Usando modo local (apenas para testes).');
            
            const clienteLocal = {
                id: 'LOCAL_' + Date.now(),
                email: email,
                nome: '',
                cnpj: '',
                telefone: '',
                isAdmin: email === 'adm.rdvolantes@gmail.com'
            };
            
            salvarSessao(clienteLocal);
            
            return { 
                sucesso: true, 
                mensagem: 'Login local (configure o Google Apps Script para produção)',
                cliente: clienteLocal
            };
        }
        
        return { sucesso: false, mensagem: 'Erro ao fazer login. Verifique suas credenciais.' };
    }
}

/**
 * Atualizar dados do cliente
 */
async function atualizarDadosCliente(dadosCompletos) {
    try {
        const usuario = usuarioLogado();
        if (!usuario) {
            return { sucesso: false, mensagem: 'Usuário não está logado' };
        }
        
        // Enviar para Google Apps Script
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                acao: 'atualizar_cliente',
                clienteId: usuario.id,
                ...dadosCompletos
            })
        });
        
        // Atualizar localmente
        Object.keys(dadosCompletos).forEach(key => {
            usuario[key] = dadosCompletos[key];
        });
        localStorage.setItem(STORAGE_KEYS.USUARIO, JSON.stringify(usuario));
        
        return { sucesso: true, mensagem: 'Dados atualizados com sucesso' };
        
    } catch (erro) {
        console.error('Erro ao atualizar dados:', erro);
        return { sucesso: false, mensagem: 'Erro ao atualizar: ' + erro.message };
    }
}

/**
 * Salvar orçamento
 */
async function salvarOrcamento(itens, observacao = '') {
    try {
        const usuario = usuarioLogado();
        if (!usuario) {
            console.warn('Orçamento não salvo: usuário não está logado');
            return { sucesso: false, mensagem: 'Usuário não está logado' };
        }
        
        // Enviar para Google Apps Script
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                acao: 'salvar_orcamento',
                clienteId: usuario.id,
                totalItens: itens.length,
                observacao: observacao,
                status: 'Pendente',
                itens: itens
            })
        });
        
        console.log('✅ Orçamento salvo com sucesso');
        return { sucesso: true, mensagem: 'Orçamento salvo com sucesso' };
        
    } catch (erro) {
        console.error('Erro ao salvar orçamento:', erro);
        return { sucesso: false, mensagem: 'Erro ao salvar: ' + erro.message };
    }
}

/**
 * Buscar orçamentos do cliente
 */
async function buscarOrcamentos() {
    try {
        const usuario = usuarioLogado();
        if (!usuario) {
            return { sucesso: false, mensagem: 'Usuário não está logado' };
        }
        
        const params = new URLSearchParams({
            acao: 'buscar_orcamentos',
            clienteId: usuario.id
        });
        
        const resposta = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`, {
            method: 'GET',
            redirect: 'follow'
        });
        
        const dados = await resposta.json();
        return dados;
        
    } catch (erro) {
        console.error('Erro ao buscar orçamentos:', erro);
        return { 
            sucesso: true, 
            orcamentos: [] // Retorna lista vazia se houver erro
        };
    }
}

/**
 * Buscar TODOS os orçamentos (apenas para admin)
 */
async function buscarTodosOrcamentos() {
    try {
        const usuario = usuarioLogado();
        
        // Verificar se é admin
        if (!usuario || !usuario.isAdmin) {
            return { 
                sucesso: false, 
                mensagem: 'Acesso negado. Apenas admins podem visualizar todos os orçamentos.' 
            };
        }
        
        const params = new URLSearchParams({
            acao: 'buscar_todos_orcamentos'
        });
        
        const resposta = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`, {
            method: 'GET',
            redirect: 'follow'
        });
        
        const dados = await resposta.json();
        return dados;
        
    } catch (erro) {
        console.error('Erro ao buscar todos os orçamentos:', erro);
        return { 
            sucesso: false, 
            mensagem: 'Erro ao buscar orçamentos',
            orcamentos: []
        };
    }
}

/**
 * Buscar todos os clientes (apenas para admin)
 */
async function buscarTodosClientes() {
    try {
        const usuario = usuarioLogado();
        
        // Verificar se é admin
        if (!usuario || !usuario.isAdmin) {
            return { 
                sucesso: false, 
                mensagem: 'Acesso negado. Apenas admins podem visualizar clientes.' 
            };
        }
        
        const params = new URLSearchParams({
            acao: 'buscar_clientes'
        });
        
        const resposta = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`, {
            method: 'GET',
            redirect: 'follow'
        });
        
        const dados = await resposta.json();
        return dados;
        
    } catch (erro) {
        console.error('Erro ao buscar todos os clientes:', erro);
        return { 
            sucesso: false, 
            mensagem: 'Erro ao buscar clientes',
            clientes: []
        };
    }
}

/**
 * Preencher campos do formulário com dados do usuário logado
 */
function preencherDadosCliente() {
    const usuario = usuarioLogado();
    if (!usuario) return;
    
    // Preencher campos se existirem
    const campoNome = document.getElementById('clienteNome');
    const campoCNPJ = document.getElementById('clienteCNPJ');
    const campoEmail = document.getElementById('clienteEmail');
    const campoTelefone = document.getElementById('clienteTelefone');
    
    if (campoNome && usuario.nome) campoNome.value = usuario.nome;
    if (campoCNPJ && usuario.cnpj) campoCNPJ.value = usuario.cnpj;
    if (campoEmail && usuario.email) campoEmail.value = usuario.email;
    if (campoTelefone && usuario.telefone) campoTelefone.value = usuario.telefone;
}

/**
 * Exibir status de login no header
 */
function exibirStatusLogin() {
    const usuario = usuarioLogado();
    const header = document.querySelector('header .menu_top ul');
    
    if (!header) return;
    
    // Remover itens de login existentes
    const itensExistentes = header.querySelectorAll('.auth-item');
    itensExistentes.forEach(item => item.remove());
    
    if (usuario) {
        // Usuário logado
        const nomeExibir = usuario.nome || usuario.email.split('@')[0];
        
        // Se é admin, adicionar link para painel admin
        if (usuario.isAdmin) {
            const liAdmin = document.createElement('li');
            liAdmin.className = 'auth-item';
            liAdmin.innerHTML = `<a href="admin.html" style="display: flex; align-items: center; gap: 6px; color: #d84040; font-weight: 600;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
                Painel Admin
            </a>`;
            header.appendChild(liAdmin);
        }
        
        const liUsuario = document.createElement('li');
        liUsuario.className = 'auth-item';
        liUsuario.innerHTML = `<a href="area-cliente.html" style="display: flex; align-items: center; gap: 6px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle;">
                <path d="M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 14H4v-3h16v3zm0-5H4v-5h16v5z"/>
                <circle cx="12" cy="8" r="2" fill="#1E90FF"/>
            </svg>
            ${nomeExibir}
        </a>`;
        
        const liLogout = document.createElement('li');
        liLogout.className = 'auth-item';
        liLogout.innerHTML = `<a href="#" id="btn-logout">Sair</a>`;
        
        header.appendChild(liUsuario);
        header.appendChild(liLogout);
        
        // Adicionar evento de logout
        document.getElementById('btn-logout')?.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.reload();
        });
    } else {
        // Usuário não logado
        const liLogin = document.createElement('li');
        liLogin.className = 'auth-item';
        liLogin.innerHTML = `<a href="login.html" style="display: flex; align-items: center; gap: 6px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle;">
                <path d="M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 14H4v-3h16v3zm0-5H4v-5h16v5z"/>
                <circle cx="12" cy="8" r="2" fill="#1E90FF"/>
            </svg>
            Área do Cliente
        </a>`;
        
        header.appendChild(liLogin);
    }
}

/**
 * Deletar um orçamento específico (admin only)
 */
async function deletarOrcamento(orcamentoId) {
  const usuarioJson = localStorage.getItem('usuario');
  if (!usuarioJson) {
    alert('Você não está logado');
    return false;
  }

  const usuario = JSON.parse(usuarioJson);
  if (!usuario.isAdmin) {
    alert('Apenas admin pode deletar orçamentos');
    return false;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        acao: 'deletar_orcamento',
        orcamentoId: orcamentoId
      })
    });

    const resultado = await response.json();
    
    if (resultado.sucesso) {
      return true;
    } else {
      alert('Erro ao deletar orçamento: ' + resultado.mensagem);
      return false;
    }
  } catch (erro) {
    console.error('Erro ao deletar orçamento:', erro);
    alert('Erro ao deletar orçamento');
    return false;
  }
}

/**
 * Deletar um cliente e todos os seus orçamentos (admin only)
 */
async function deletarCliente(clienteId) {
  const usuarioJson = localStorage.getItem('usuario');
  if (!usuarioJson) {
    alert('Você não está logado');
    return false;
  }

  const usuario = JSON.parse(usuarioJson);
  if (!usuario.isAdmin) {
    alert('Apenas admin pode deletar clientes');
    return false;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        acao: 'deletar_cliente',
        clienteId: clienteId
      })
    });

    const resultado = await response.json();
    
    if (resultado.sucesso) {
      return true;
    } else {
      alert('Erro ao deletar cliente: ' + resultado.mensagem);
      return false;
    }
  } catch (erro) {
    console.error('Erro ao deletar cliente:', erro);
    alert('Erro ao deletar cliente');
    return false;
  }
}

/**
 * Trocar senha do usuário logado
 */
async function trocarSenha(senhaAtual, novaSenha) {
  const usuarioJson = localStorage.getItem('usuario');
  if (!usuarioJson) {
    alert('Você não está logado');
    return false;
  }

  const usuario = JSON.parse(usuarioJson);

  try {
    // Hash da senha atual
    const senhaAtualHash = await hashSenha(senhaAtual);
    
    // Hash da nova senha
    const novaSenhaHash = await hashSenha(novaSenha);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        acao: 'trocar_senha',
        clienteId: usuario.id,
        senhaAtualHash: senhaAtualHash,
        novasenhaHash: novaSenhaHash
      })
    });

    const resultado = await response.json();
    
    if (resultado.sucesso) {
      return true;
    } else {
      alert('Erro ao trocar senha: ' + resultado.mensagem);
      return false;
    }
  } catch (erro) {
    console.error('Erro ao trocar senha:', erro);
    alert('Erro ao trocar senha');
    return false;
  }
}

// Inicializar quando a página carregar
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        exibirStatusLogin();
        preencherDadosCliente();
    });
}
