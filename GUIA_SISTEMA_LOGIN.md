# 🔐 GUIA: Sistema de Login e Histórico de Orçamentos

Este guia explica como configurar o sistema de login com Google Sheets para gerenciar clientes e histórico de orçamentos.

---

## 📋 VISÃO GERAL

O sistema permite:
- ✅ Cadastro e login de clientes
- ✅ Salvamento automático dos dados cadastrais
- ✅ Histórico completo de todos os orçamentos realizados
- ✅ Área do cliente para visualizar pedidos anteriores
- ✅ Preenchimento automático dos dados em novos orçamentos

---

## 🚀 PASSO 1: Criar Novas Abas na Planilha

Na sua planilha do Google Sheets (a mesma que já tem os produtos), crie 2 novas abas:

### Aba `clientes`
Cabeçalhos na linha 1:
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| id | email | senha | nome | cnpj | telefone | data_cadastro |

### Aba `orcamentos`  
Cabeçalhos na linha 1:
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| id | cliente_id | data | total_itens | observacao | status | itens_json |

**IMPORTANTE:**
- Os nomes devem ser exatamente esses (minúsculos, sem acento)
- A coluna `itens_json` conterá os produtos do orçamento em formato JSON

---

## 🔧 PASSO 2: Configurar Google Apps Script

O Google Apps Script é necessário para permitir que o site leia e escreva dados na planilha.

### 2.1 Abrir o Editor de Scripts
1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o código padrão que aparece
3. Cole o código fornecido no arquivo `google-apps-script.js`

### 2.2 Implantar como Web App
1. Clique em **Implantar → Nova implantação**
2. Clique no ícone de engrenagem ⚙️ ao lado de "Selecione o tipo"
3. Escolha **Aplicativo da Web**
4. Configure:
   - **Descrição:** Sistema de Login RD Volantes
   - **Executar como:** Eu (seu email)
   - **Quem tem acesso:** Qualquer pessoa
5. Clique em **Implantar**
6. Autorize o acesso quando solicitado
7. **COPIE A URL DA WEB APP** que aparece (algo como: `https://script.google.com/macros/s/[ID]/exec`)

### 2.3 Configurar a URL no Site
1. Abra o arquivo `auth.js`
2. Encontre a linha:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'COLE_SUA_URL_AQUI';
   ```
3. Substitua pela URL que você copiou

---

## 🎨 PASSO 3: Estrutura do Sistema

O sistema é composto por:

### Arquivos criados:
- `login.html` - Página de login e cadastro
- `auth.js` - Sistema de autenticação
- `area-cliente.html` - Dashboard do cliente
- `area-cliente.js` - Lógica da área do cliente
- `google-apps-script.js` - Backend (Google Apps Script)

### Integração:
- O `carrinho.html` foi atualizado para detectar usuário logado
- Dados são preenchidos automaticamente quando logado
- Orçamentos são salvos automaticamente no Google Sheets

---

## 🔐 SEGURANÇA

### Senhas
- As senhas são hasheadas com SHA-256
- Nunca são armazenadas em texto puro
- Session token no localStorage com expiração de 7 dias

### Acesso
- Cada cliente vê apenas seus próprios orçamentos
- ID único gerado automaticamente (timestamp + random)

---

## 📱 COMO USAR (Cliente)

### Primeiro Acesso:
1. Acessar `login.html`
2. Clicar em "Criar uma conta"
3. Preencher dados (email e senha são obrigatórios)
4. Fazer login

### Fazendo Orçamentos:
1. Navegar normalmente pelo site
2. Adicionar produtos ao carrinho
3. Ir para `carrinho.html`
4. **Dados são preenchidos automaticamente!**
5. Gerar PDF ou enviar orçamento
6. **Orçamento é salvo automaticamente no histórico**

### Visualizar Histórico:
1. Acessar `area-cliente.html`
2. Ver todos os orçamentos anteriores
3. Filtrar por data, visualizar detalhes
4. Fazer novo orçamento com produtos anteriores

---

## 🛠️ MANUTENÇÃO

### Ver Clientes Cadastrados
Abra a aba `clientes` na planilha do Google Sheets

### Ver Orçamentos Realizados
Abra a aba `orcamentos` na planilha do Google Sheets

### Resetar Senha de Cliente
1. Localize o cliente na aba `clientes`
2. Gere novo hash SHA-256 da senha desejada em: https://emn178.github.io/online-tools/sha256.html
3. Substitua na coluna `senha`

---

## ⚠️ NOTAS IMPORTANTES

1. **Google Apps Script tem limites:**
   - 30.000 invocações por dia (mais que suficiente)
   - Se precisar de mais, pode criar conta Google Workspace

2. **Cache local:**
   - Dados do usuário ficam em cache no navegador
   - Se limpar o cache, precisa fazer login novamente

3. **Atualização em tempo real:**
   - Mudanças na planilha aparecem no site em ~5 segundos

4. **Backup:**
   - Recomendo fazer backup da planilha semanalmente
   - Arquivo → Fazer download → Excel ou CSV

---

## 🎯 PRÓXIMAS MELHORIAS POSSÍVEIS

- [ ] Recuperação de senha por email
- [ ] Notificação por email quando orçamento é aprovado
- [ ] Status do orçamento (Pendente, Aprovado, Enviado)
- [ ] Upload de documentos (CNH, CNPJ, etc)
- [ ] Sistema de favoritos
- [ ] Carrinho salvo na nuvem

---

## 🆘 RESOLUÇÃO DE PROBLEMAS

### Erro ao fazer login
- Verifique se a URL do Apps Script está correta em `auth.js`
- Verifique se o Apps Script foi implantado com acesso "Qualquer pessoa"
- Abra o Console (F12) e veja os erros

### Dados não aparecem
- Verifique se as abas `clientes` e `orcamentos` existem
- Verifique se os cabeçalhos estão corretos (minúsculos, sem acento)

### Orçamento não salva
- Verifique se está logado
- Verifique conexão com internet
- Veja o Console (F12) para erros

---

Pronto! Agora você tem um sistema completo de autenticação e histórico. 🎉
