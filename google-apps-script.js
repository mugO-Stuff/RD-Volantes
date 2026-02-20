/**
 * GOOGLE APPS SCRIPT - Backend para Sistema de Login RD Volantes
 * 
 * Como usar:
 * 1. Na planilha Google Sheets, vá em Extensões → Apps Script
 * 2. Cole este código
 * 3. Clique em Implantar → Nova implantação → Aplicativo da Web
 * 4. Configure: Executar como "Eu", Acesso "Qualquer pessoa"
 * 5. Copie a URL gerada e cole no arquivo auth.js
 */

// ID da sua planilha (pegue da URL)
const SPREADSHEET_ID = '1hlkmU8txN3b_CGw1OKJVeNaqUAaOZ4tGQsdM3J4QYok';

/**
 * Função principal - recebe requisições POST
 */
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const acao = dados.acao;
    
    let resultado;
    
    switch(acao) {
      case 'cadastrar':
        resultado = cadastrarCliente(dados);
        break;
      case 'login':
        resultado = fazerLogin(dados);
        break;
      case 'buscar_cliente':
        resultado = buscarCliente(dados);
        break;
      case 'atualizar_cliente':
        resultado = atualizarCliente(dados);
        break;
      case 'salvar_orcamento':
        resultado = salvarOrcamento(dados);
        break;
      case 'buscar_orcamentos':
        resultado = buscarOrcamentos(dados);
        break;
      case 'deletar_orcamento':
        resultado = deletarOrcamento(dados);
        break;
      case 'deletar_cliente':
        resultado = deletarCliente(dados);
        break;
      case 'trocar_senha':
        resultado = trocarSenha(dados);
        break;
      default:
        resultado = { sucesso: false, mensagem: 'Ação inválida' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        sucesso: false, 
        mensagem: 'Erro no servidor: ' + erro.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para requisições GET (teste e login)
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const acao = params.acao;
    
    let resultado;
    
    if (acao === 'login') {
      resultado = fazerLogin(params);
    } else if (acao === 'buscar_orcamentos') {
      resultado = buscarOrcamentos(params);
    } else if (acao === 'buscar_todos_orcamentos') {
      resultado = buscarTodosOrcamentos();
    } else if (acao === 'buscar_clientes') {
      resultado = buscarClientes();
    } else {
      resultado = { 
        status: 'ok', 
        mensagem: 'API RD Volantes funcionando!',
        versao: '1.0'
      };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        sucesso: false, 
        mensagem: 'Erro: ' + erro.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Cadastrar novo cliente
 */
function cadastrarCliente(dados) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaClientes = ss.getSheetByName('clientes');
  
  if (!abaClientes) {
    return { sucesso: false, mensagem: 'Aba "clientes" não encontrada' };
  }
  
  // Verificar se email já existe
  const todosClientes = abaClientes.getDataRange().getValues();
  for (let i = 1; i < todosClientes.length; i++) {
    if (todosClientes[i][1] === dados.email) {
      return { sucesso: false, mensagem: 'Email já cadastrado' };
    }
  }
  
  // Gerar ID único
  const id = 'CLI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const dataAtual = new Date().toISOString();
  
  // Adicionar nova linha
  abaClientes.appendRow([
    id,
    dados.email,
    dados.senhaHash, // Senha já vem hasheada do frontend
    dados.nome || '',
    dados.cnpj || '',
    dados.telefone || '',
    dataAtual
  ]);
  
  return { 
    sucesso: true, 
    mensagem: 'Cliente cadastrado com sucesso',
    cliente: {
      id: id,
      email: dados.email,
      nome: dados.nome || '',
      cnpj: dados.cnpj || '',
      telefone: dados.telefone || ''
    }
  };
}

/**
 * Fazer login
 */
function fazerLogin(dados) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaClientes = ss.getSheetByName('clientes');
  
  if (!abaClientes) {
    return { sucesso: false, mensagem: 'Aba "clientes" não encontrada' };
  }
  
  const todosClientes = abaClientes.getDataRange().getValues();
  
  // Procurar cliente
  for (let i = 1; i < todosClientes.length; i++) {
    const linha = todosClientes[i];
    
    if (linha[1] === dados.email && linha[2] === dados.senhaHash) {
      return {
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        cliente: {
          id: linha[0],
          email: linha[1],
          nome: linha[3],
          cnpj: linha[4],
          telefone: linha[5],
          dataCadastro: linha[6],
          // Novos campos
          fantasia: linha[7] || '',
          codigo: linha[8] || '',
          tipoPessoa: linha[9] || '',
          cpf: linha[10] || '',
          rg: linha[11] || '',
          orgaoEmissor: linha[12] || '',
          inscricaoEstadualPF: linha[13] || '',
          regimeTributario: linha[14] || '',
          inscricaoEstadual: linha[15] || '',
          inscricaoMunicipal: linha[16] || '',
          ieIsento: linha[17] || '',
          clienteDesde: linha[18] || '',
          contribuinte: linha[19] || '',
          cep: linha[20] || '',
          uf: linha[21] || '',
          cidade: linha[22] || '',
          bairro: linha[23] || '',
          endereco: linha[24] || '',
          numero: linha[25] || '',
          complemento: linha[26] || '',
          // Endereço da Transportadora
          transpCep: linha[27] || '',
          transpUf: linha[28] || '',
          transpCidade: linha[29] || '',
          transpBairro: linha[30] || '',
          transpEndereco: linha[31] || '',
          transpNumero: linha[32] || '',
          transpComplemento: linha[33] || ''
        }
      };
    }
  }
  
  return { sucesso: false, mensagem: 'Email ou senha incorretos' };
}

/**
 * Buscar dados do cliente por ID
 */
function buscarCliente(dados) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaClientes = ss.getSheetByName('clientes');
  
  if (!abaClientes) {
    return { sucesso: false, mensagem: 'Aba "clientes" não encontrada' };
  }
  
  const todosClientes = abaClientes.getDataRange().getValues();
  
  for (let i = 1; i < todosClientes.length; i++) {
    const linha = todosClientes[i];
    
    if (linha[0] === dados.clienteId) {
      return {
        sucesso: true,
        cliente: {
          id: linha[0],
          email: linha[1],
          nome: linha[3],
          cnpj: linha[4],
          telefone: linha[5],
          dataCadastro: linha[6],
          // Novos campos
          fantasia: linha[7] || '',
          codigo: linha[8] || '',
          tipoPessoa: linha[9] || '',
          cpf: linha[10] || '',
          rg: linha[11] || '',
          orgaoEmissor: linha[12] || '',
          inscricaoEstadualPF: linha[13] || '',
          regimeTributario: linha[14] || '',
          inscricaoEstadual: linha[15] || '',
          inscricaoMunicipal: linha[16] || '',
          ieIsento: linha[17] || '',
          clienteDesde: linha[18] || '',
          contribuinte: linha[19] || '',
          cep: linha[20] || '',
          uf: linha[21] || '',
          cidade: linha[22] || '',
          bairro: linha[23] || '',
          endereco: linha[24] || '',
          numero: linha[25] || '',
          complemento: linha[26] || '',
          // Endereço da Transportadora
          transpCep: linha[27] || '',
          transpUf: linha[28] || '',
          transpCidade: linha[29] || '',
          transpBairro: linha[30] || '',
          transpEndereco: linha[31] || '',
          transpNumero: linha[32] || '',
          transpComplemento: linha[33] || ''
        }
      };
    }
  }
  
  return { sucesso: false, mensagem: 'Cliente não encontrado' };
}

/**
 * Atualizar dados do cliente
 */
function atualizarCliente(dados) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaClientes = ss.getSheetByName('clientes');
  
  if (!abaClientes) {
    return { sucesso: false, mensagem: 'Aba "clientes" não encontrada' };
  }
  
  const todosClientes = abaClientes.getDataRange().getValues();
  
  for (let i = 1; i < todosClientes.length; i++) {
    if (todosClientes[i][0] === dados.clienteId) {
      // Atualizar campos básicos (colunas antigas - retrocompatível)
      abaClientes.getRange(i + 1, 4).setValue(dados.nome || '');
      abaClientes.getRange(i + 1, 5).setValue(dados.cnpj || '');
      abaClientes.getRange(i + 1, 6).setValue(dados.telefone || '');
      
      // Novos campos (se existirem)
      // Coluna 8: fantasia
      if (dados.fantasia !== undefined) {
        abaClientes.getRange(i + 1, 8).setValue(dados.fantasia || '');
      }
      // Coluna 9: codigo
      if (dados.codigo !== undefined) {
        abaClientes.getRange(i + 1, 9).setValue(dados.codigo || '');
      }
      // Coluna 10: tipoPessoa
      if (dados.tipoPessoa !== undefined) {
        abaClientes.getRange(i + 1, 10).setValue(dados.tipoPessoa || '');
      }
      // Coluna 11: cpf
      if (dados.cpf !== undefined) {
        abaClientes.getRange(i + 1, 11).setValue(dados.cpf || '');
      }
      // Coluna 12: rg
      if (dados.rg !== undefined) {
        abaClientes.getRange(i + 1, 12).setValue(dados.rg || '');
      }
      // Coluna 13: orgaoEmissor
      if (dados.orgaoEmissor !== undefined) {
        abaClientes.getRange(i + 1, 13).setValue(dados.orgaoEmissor || '');
      }
      // Coluna 14: inscricaoEstadualPF
      if (dados.inscricaoEstadualPF !== undefined) {
        abaClientes.getRange(i + 1, 14).setValue(dados.inscricaoEstadualPF || '');
      }
      // Coluna 15: regimeTributario
      if (dados.regimeTributario !== undefined) {
        abaClientes.getRange(i + 1, 15).setValue(dados.regimeTributario || '');
      }
      // Coluna 16: inscricaoEstadual
      if (dados.inscricaoEstadual !== undefined) {
        abaClientes.getRange(i + 1, 16).setValue(dados.inscricaoEstadual || '');
      }
      // Coluna 17: inscricaoMunicipal
      if (dados.inscricaoMunicipal !== undefined) {
        abaClientes.getRange(i + 1, 17).setValue(dados.inscricaoMunicipal || '');
      }
      // Coluna 18: ieIsento
      if (dados.ieIsento !== undefined) {
        abaClientes.getRange(i + 1, 18).setValue(dados.ieIsento || '');
      }
      // Coluna 19: clienteDesde
      if (dados.clienteDesde !== undefined) {
        abaClientes.getRange(i + 1, 19).setValue(dados.clienteDesde || '');
      }
      // Coluna 20: contribuinte
      if (dados.contribuinte !== undefined) {
        abaClientes.getRange(i + 1, 20).setValue(dados.contribuinte || '');
      }
      // Coluna 21: cep
      if (dados.cep !== undefined) {
        abaClientes.getRange(i + 1, 21).setValue(dados.cep || '');
      }
      // Coluna 22: uf
      if (dados.uf !== undefined) {
        abaClientes.getRange(i + 1, 22).setValue(dados.uf || '');
      }
      // Coluna 23: cidade
      if (dados.cidade !== undefined) {
        abaClientes.getRange(i + 1, 23).setValue(dados.cidade || '');
      }
      // Coluna 24: bairro
      if (dados.bairro !== undefined) {
        abaClientes.getRange(i + 1, 24).setValue(dados.bairro || '');
      }
      // Coluna 25: endereco
      if (dados.endereco !== undefined) {
        abaClientes.getRange(i + 1, 25).setValue(dados.endereco || '');
      }
      // Coluna 26: numero
      if (dados.numero !== undefined) {
        abaClientes.getRange(i + 1, 26).setValue(dados.numero || '');
      }
      // Coluna 27: complemento
      if (dados.complemento !== undefined) {
        abaClientes.getRange(i + 1, 27).setValue(dados.complemento || '');
      }
      // Coluna 28: transpCep
      if (dados.transpCep !== undefined) {
        abaClientes.getRange(i + 1, 28).setValue(dados.transpCep || '');
      }
      // Coluna 29: transpUf
      if (dados.transpUf !== undefined) {
        abaClientes.getRange(i + 1, 29).setValue(dados.transpUf || '');
      }
      // Coluna 30: transpCidade
      if (dados.transpCidade !== undefined) {
        abaClientes.getRange(i + 1, 30).setValue(dados.transpCidade || '');
      }
      // Coluna 31: transpBairro
      if (dados.transpBairro !== undefined) {
        abaClientes.getRange(i + 1, 31).setValue(dados.transpBairro || '');
      }
      // Coluna 32: transpEndereco
      if (dados.transpEndereco !== undefined) {
        abaClientes.getRange(i + 1, 32).setValue(dados.transpEndereco || '');
      }
      // Coluna 33: transpNumero
      if (dados.transpNumero !== undefined) {
        abaClientes.getRange(i + 1, 33).setValue(dados.transpNumero || '');
      }
      // Coluna 34: transpComplemento
      if (dados.transpComplemento !== undefined) {
        abaClientes.getRange(i + 1, 34).setValue(dados.transpComplemento || '');
      }
      
      return { 
        sucesso: true, 
        mensagem: 'Dados atualizados com sucesso' 
      };
    }
  }
  
  return { sucesso: false, mensagem: 'Cliente não encontrado' };
}

/**
 * Salvar orçamento
 */
function salvarOrcamento(dados) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaOrcamentos = ss.getSheetByName('orcamentos');
  
  if (!abaOrcamentos) {
    return { sucesso: false, mensagem: 'Aba "orcamentos" não encontrada' };
  }
  
  // Gerar ID único
  const id = 'ORC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const dataAtual = new Date().toISOString();
  
  // Adicionar nova linha
  abaOrcamentos.appendRow([
    id,
    dados.clienteId,
    dataAtual,
    dados.totalItens || 0,
    dados.observacao || '',
    dados.status || 'Pendente',
    JSON.stringify(dados.itens || [])
  ]);
  
  return { 
    sucesso: true, 
    mensagem: 'Orçamento salvo com sucesso',
    orcamentoId: id
  };
}

/**
 * Buscar orçamentos do cliente
 */
function buscarOrcamentos(dados) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaOrcamentos = ss.getSheetByName('orcamentos');
  
  if (!abaOrcamentos) {
    return { sucesso: false, mensagem: 'Aba "orcamentos" não encontrada' };
  }
  
  const todosOrcamentos = abaOrcamentos.getDataRange().getValues();
  const orcamentosCliente = [];
  
  // Procurar orçamentos do cliente
  for (let i = 1; i < todosOrcamentos.length; i++) {
    const linha = todosOrcamentos[i];
    
    if (linha[1] === dados.clienteId) {
      try {
        orcamentosCliente.push({
          id: linha[0],
          clienteId: linha[1],
          data: linha[2],
          totalItens: linha[3],
          observacao: linha[4],
          status: linha[5],
          itens: JSON.parse(linha[6] || '[]')
        });
      } catch (e) {
        // Se falhar ao parsear JSON, adiciona sem itens
        orcamentosCliente.push({
          id: linha[0],
          clienteId: linha[1],
          data: linha[2],
          totalItens: linha[3],
          observacao: linha[4],
          status: linha[5],
          itens: []
        });
      }
    }
  }
  
  // Ordenar por data (mais recente primeiro)
  orcamentosCliente.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  return { 
    sucesso: true, 
    orcamentos: orcamentosCliente
  };
}

/**
 * Buscar TODOS os orçamentos (para admin)
 * Retorna todos os orçamentos com dados do cliente inclusos
 */
function buscarTodosOrcamentos() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const abaOrcamentos = ss.getSheetByName('orcamentos');
    const abaClientes = ss.getSheetByName('clientes');
    
    if (!abaOrcamentos || !abaClientes) {
      return { 
        sucesso: false, 
        mensagem: 'Abas "orcamentos" ou "clientes" não encontradas' 
      };
    }
    
    // Carregar todos os orçamentos
    const todosOrcamentos = abaOrcamentos.getDataRange().getValues();
    const todosClientes = abaClientes.getDataRange().getValues();
    
    // Mapear clientes por ID para busca rápida
    const clientesMap = {};
    for (let i = 1; i < todosClientes.length; i++) {
      const linha = todosClientes[i];
      if (linha[0]) { // ID do cliente (coluna A)
        clientesMap[linha[0]] = {
          id: linha[0],
          email: linha[1],
          nome: linha[3], // Coluna D = Razão Social
          cnpj: linha[4]  // Coluna E = CNPJ
        };
      }
    }
    
    // Processar todos os orçamentos
    const orcamentos = [];
    for (let i = 1; i < todosOrcamentos.length; i++) {
      const linha = todosOrcamentos[i];
      
      try {
        const clienteInfo = clientesMap[linha[1]] || {
          id: linha[1],
          email: 'desconhecido',
          nome: 'Cliente Desconhecido',
          cnpj: ''
        };
        
        orcamentos.push({
          id: linha[0],
          clienteId: linha[1],
          clienteEmail: clienteInfo.email,
          clienteNome: clienteInfo.nome,
          clienteCNPJ: clienteInfo.cnpj,
          data: linha[2],
          totalItens: linha[3],
          observacao: linha[4],
          status: linha[5],
          itens: JSON.parse(linha[6] || '[]')
        });
      } catch (e) {
        // Se falhar ao parsear JSON, adiciona sem itens
        const clienteInfo = clientesMap[linha[1]] || {
          id: linha[1],
          email: 'desconhecido',
          nome: 'Cliente Desconhecido',
          cnpj: ''
        };
        
        orcamentos.push({
          id: linha[0],
          clienteId: linha[1],
          clienteEmail: clienteInfo.email,
          clienteNome: clienteInfo.nome,
          clienteCNPJ: clienteInfo.cnpj,
          data: linha[2],
          totalItens: linha[3],
          observacao: linha[4],
          status: linha[5],
          itens: []
        });
      }
    }
    
    // Ordenar por data (mais recente primeiro)
    orcamentos.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    return { 
      sucesso: true, 
      orcamentos: orcamentos
    };
    
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao buscar orçamentos: ' + erro.message,
      orcamentos: []
    };
  }
}

/**
 * Buscar todos os clientes (para admin)
 */
function buscarClientes() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const abaClientes = ss.getSheetByName('clientes');
    
    if (!abaClientes) {
      return { 
        sucesso: false, 
        mensagem: 'Aba "clientes" não encontrada' 
      };
    }
    
    // Carregar todos os clientes
    const todosClientes = abaClientes.getDataRange().getValues();
    const clientes = [];
    
    for (let i = 1; i < todosClientes.length; i++) {
      const linha = todosClientes[i];
      
      if (linha[0]) { // Verificar se tem ID
        clientes.push({
          id: linha[0],
          email: linha[1] || '',
          dataCadastro: linha[6] || '',
          razaoSocial: linha[3] || '',
          cnpj: linha[4] || '',
          telefone: linha[5] || '',
          tipoPessoa: linha[7] || '',
          cpf: linha[8] || '',
          rg: linha[9] || '',
          fantasia: linha[2] || ''
        });
      }
    }
    
    // Ordenar por data de cadastro (mais recente primeiro)
    clientes.sort((a, b) => {
      try {
        return new Date(b.dataCadastro) - new Date(a.dataCadastro);
      } catch {
        return 0;
      }
    });
    
    return { 
      sucesso: true, 
      clientes: clientes
    };
    
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao buscar clientes: ' + erro.message,
      clientes: []
    };
  }
}

/**
 * Deletar orçamento por ID
 */
function deletarOrcamento(dados) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const abaOrcamentos = ss.getSheetByName('orcamentos');
    
    if (!abaOrcamentos) {
      return { 
        sucesso: false, 
        mensagem: 'Aba "orcamentos" não encontrada' 
      };
    }
    
    const todosOrcamentos = abaOrcamentos.getDataRange().getValues();
    
    // Procurar orçamento por ID
    for (let i = 1; i < todosOrcamentos.length; i++) {
      if (todosOrcamentos[i][0] === dados.orcamentoId) {
        // Deletar a linha (i+1 porque Google Sheets é 1-indexed)
        abaOrcamentos.deleteRow(i + 1);
        
        return { 
          sucesso: true, 
          mensagem: 'Orçamento deletado com sucesso'
        };
      }
    }
    
    return { 
      sucesso: false, 
      mensagem: 'Orçamento não encontrado' 
    };
    
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao deletar orçamento: ' + erro.message
    };
  }
}

/**
 * Deletar cliente por ID
 * Também deleta todos os orçamentos associados ao cliente
 */
function deletarCliente(dados) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const abaClientes = ss.getSheetByName('clientes');
    const abaOrcamentos = ss.getSheetByName('orcamentos');
    
    if (!abaClientes) {
      return { 
        sucesso: false, 
        mensagem: 'Aba "clientes" não encontrada' 
      };
    }
    
    // Primeiro, deletar todos os orçamentos do cliente
    if (abaOrcamentos) {
      const todosOrcamentos = abaOrcamentos.getDataRange().getValues();
      
      // Deletar de trás para frente para não perder índices
      for (let i = todosOrcamentos.length - 1; i >= 1; i--) {
        if (todosOrcamentos[i][1] === dados.clienteId) {
          abaOrcamentos.deleteRow(i + 1);
        }
      }
    }
    
    // Depois, deletar o cliente
    const todosClientes = abaClientes.getDataRange().getValues();
    
    for (let i = 1; i < todosClientes.length; i++) {
      if (todosClientes[i][0] === dados.clienteId) {
        abaClientes.deleteRow(i + 1);
        
        return { 
          sucesso: true, 
          mensagem: 'Cliente e seus orçamentos deletados com sucesso'
        };
      }
    }
    
    return { 
      sucesso: false, 
      mensagem: 'Cliente não encontrado' 
    };
    
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao deletar cliente: ' + erro.message
    };
  }
}

/**
 * Trocar senha do cliente
 */
function trocarSenha(dados) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const abaClientes = ss.getSheetByName('clientes');
    
    if (!abaClientes) {
      return { 
        sucesso: false, 
        mensagem: 'Aba "clientes" não encontrada' 
      };
    }
    
    const todosClientes = abaClientes.getDataRange().getValues();
    
    // Procurar cliente por ID
    for (let i = 1; i < todosClientes.length; i++) {
      if (todosClientes[i][0] === dados.clienteId && todosClientes[i][2] === dados.senhaAtualHash) {
        // Senha atual está correta, atualizar para nova
        abaClientes.getRange(i + 1, 3).setValue(dados.novasenhaHash);
        
        return { 
          sucesso: true, 
          mensagem: 'Senha alterada com sucesso'
        };
      }
    }
    
    return { 
      sucesso: false, 
      mensagem: 'Seu email ou senha atual estão incorretos' 
    };
    
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao trocar senha: ' + erro.message
    };
  }
}
