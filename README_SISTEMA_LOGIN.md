# 🔐 Sistema de Login - RD Volantes

Sistema completo de autenticação e histórico de orçamentos usando Google Sheets como banco de dados.

## ✨ Funcionalidades

- ✅ **Cadastro e Login** de clientes
- ✅ **Dados automáticos** - Preenchimento automático em novos orçamentos
- ✅ **Histórico completo** - Todos orçamentos salvos e acessíveis
- ✅ **Área do cliente** - Dashboard com perfil e histórico
- ✅ **Segurança** - Senhas hasheadas com SHA-256
- ✅ **Sessão persistente** - Login mantido por 7 dias
- ✅ **Integração perfeita** - Funciona com sistema existente

## 📁 Arquivos do Sistema

### Backend
- `google-apps-script.js` - API backend (rodar no Google Apps Script)

### Frontend
- `auth.js` - Sistema de autenticação
- `login.html` - Página de login e cadastro
- `area-cliente.html` - Dashboard do cliente
- `area-cliente.js` - Lógica da área do cliente

### Documentação
- `INSTALACAO_LOGIN.md` - **COMECE AQUI** - Guia rápido de instalação
- `GUIA_SISTEMA_LOGIN.md` - Documentação completa

## 🚀 Como Instalar

**Leia:** [INSTALACAO_LOGIN.md](INSTALACAO_LOGIN.md)

Resumo:
1. Criar abas `clientes` e `orcamentos` no Google Sheets
2. Implantar código `google-apps-script.js` como Web App
3. Configurar URL no arquivo `auth.js`
4. Adicionar `<script src="auth.js"></script>` em todas as páginas
5. Fazer upload dos arquivos

## 📸 Preview

### Login
```
login.html - Tela de login/cadastro moderna e responsiva
```

### Área do Cliente
```
area-cliente.html - Dashboard com:
- Perfil do cliente
- Histórico de orçamentos
- Opção de repetir orçamentos
- Editar dados cadastrais
```

### Menu (Quando Logado)
```
Header mostra:
👤 [Nome do Cliente] | Sair
```

## 🔒 Segurança

- Senhas hasheadas com SHA-256 (nunca salvas em texto puro)
- Session token com expiração de 7 dias
- Cada cliente vê apenas seus próprios orçamentos
- ID único gerado automaticamente

## 📊 Estrutura do Google Sheets

### Aba: clientes
| id | email | senha | nome | cnpj | telefone | data_cadastro |
|----|-------|-------|------|------|----------|---------------|

### Aba: orcamentos
| id | cliente_id | data | total_itens | observacao | status | itens_json |
|----|------------|------|-------------|------------|--------|------------|

## 🎯 Fluxo do Sistema

### 1. Cliente se cadastra
```
login.html → cadastrarCliente() → Google Apps Script → Salva em 'clientes'
```

### 2. Cliente faz login
```
login.html → fazerLogin() → Google Apps Script → Retorna dados → Salva sessão
```

### 3. Cliente faz orçamento
```
Carrinho → Gera PDF → salvarOrcamento() → Google Apps Script → Salva em 'orcamentos'
```

### 4. Cliente visualiza histórico
```
area-cliente.html → buscarOrcamentos() → Google Apps Script → Lista orçamentos
```

## 💡 Modo de Desenvolvimento

Sem configurar o Google Apps Script, o sistema funciona em "modo local":
- Login funciona (localStorage apenas)
- Orçamentos NÃO são salvos na nuvem
- Útil para testes

⚠️ **Para produção, configure o Apps Script!**

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Google Apps Script (JavaScript)
- **Banco de Dados:** Google Sheets
- **Autenticação:** SHA-256 + Session Token (localStorage)
- **PDF:** jsPDF (já integrado)

## 📱 Responsivo

Sistema totalmente responsivo e funciona em:
- 📱 Mobile (smartphones)
- 📱 Tablets
- 💻 Desktop

## 🔧 Customização

### Trocar duração da sessão
Em `auth.js`, linha 18:
```javascript
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias
```

### Trocar cores do tema
Em `login.html` e `area-cliente.html`, procure por `#d84040` (vermelho principal)

### Adicionar campos extras
1. Adicionar coluna na aba `clientes`
2. Atualizar funções em `google-apps-script.js`
3. Adicionar campos nos formulários HTML

## 🐛 Debugging

### Ver usuário logado:
```javascript
console.log(usuarioLogado());
```

### Ver orçamentos:
```javascript
buscarOrcamentos().then(r => console.log(r));
```

### Limpar sessão:
```javascript
logout();
```

## 📈 Limites do Google Apps Script

- 30.000 invocações por dia (gratuito)
- 90 minutos de tempo de execução por dia
- Mais que suficiente para pequenos/médios negócios

## 🎉 Pronto!

Sistema completo e funcional. Basta seguir o guia de instalação!

---

**Dúvidas?** Leia [INSTALACAO_LOGIN.md](INSTALACAO_LOGIN.md) ou [GUIA_SISTEMA_LOGIN.md](GUIA_SISTEMA_LOGIN.md)
