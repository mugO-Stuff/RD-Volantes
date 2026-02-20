# 🚀 INSTALAÇÃO RÁPIDA - Sistema de Login

Este guia mostra como ativar o sistema de login no seu site.

---

## ✅ ARQUIVOS CRIADOS

Os seguintes arquivos foram criados e estão prontos para uso:

### Backend & Configuração:
- ✅ `google-apps-script.js` - Backend API (Google Apps Script)
- ✅ `GUIA_SISTEMA_LOGIN.md` - Documentação completa

### Frontend - Sistema de Login:
- ✅ `auth.js` - Sistema de autenticação
- ✅ `login.html` - Página de login e cadastro
- ✅ `area-cliente.html` - Dashboard do cliente
- ✅ `area-cliente.js` - Lógica da área do cliente

### Integrações:
- ✅ `carrinho.html` - Atualizado com salvamento automático de orçamentos
- ✅ `script.js` - Atualizado para salvar orçamentos no histórico

---

## 📋 PASSO A PASSO PARA ATIVAR

### 1️⃣ Configurar Google Sheets

1. Abra sua planilha do Google Sheets (a mesma que já tem os produtos)
2. Crie as abas `clientes` e `orcamentos` com os cabeçalhos:

**Aba `clientes`:**
```
id | email | senha | nome | cnpj | telefone | data_cadastro
```

**Aba `orcamentos`:**
```
id | cliente_id | data | total_itens | observacao | status | itens_json
```

### 2️⃣ Implantar Google Apps Script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o código padrão
3. Abra o arquivo `google-apps-script.js` aqui do repositório
4. **IMPORTANTE:** Na linha 13, atualize o `SPREADSHEET_ID` com o ID da sua planilha
5. Cole todo código no Apps Script
6. Clique em **Implantar → Nova implantação → Aplicativo da Web**
7. Configure:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
8. Clique em **Implantar** e autorize
9. **COPIE A URL** que aparece (vai precisar!)

### 3️⃣  Configurar a URL no Site

1. Abra o arquivo `auth.js`
2. Na linha 10, substitua:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'COLE_SUA_URL_AQUI';
   ```
   Por:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'sua-url-copiada-aqui';
   ```

### 4️⃣ Adicionar Script em Todas as Páginas

**IMPORTANTE:** Para o sistema de login aparecer no menu, adicione esta linha antes do `script.js` em TODAS as páginas HTML:

```html
<script src="auth.js"></script>
```

Páginas que precisam do script:
- [x] `carrinho.html` (já adicionado ✅)
- [ ] `index.html`
- [ ] `psdpass.html`
- [ ] `categoria-passeio.html`
- [ ] `categoria-cubos.html`
- [ ] `tampas.html`
- [ ] `outros.html`
- [ ] (qualquer outra página HTML do site)

**Como adicionar:**

Encontre a linha com `<script src="script.js...">` e adicione ANTES dela:
```html
<script src="auth.js"></script>
<script src="script.js?v=..."></script>
```

### 5️⃣ Upload dos Arquivos

Se você hospeda o site em servidor/hospedagem, faça upload de todos os arquivos novos:
- `auth.js`
- `login.html`
- `area-cliente.html`
- `area-cliente.js`
- `google-apps-script.js` (apenas para referência, o código fica no Google)

---

## 🎉 PRONTO!

O sistema de login está ativado! Agora seus clientes podem:

1. **Acessar** `login.html` para criar conta
2. **Fazer login** para salvar dados
3. **Ver histórico** de orçamentos em `area-cliente.html`
4. **Dados preenchidos automaticamente** ao fazer novos orçamentos

---

## 🔍 TESTANDO

### Teste 1: Criar Conta
1. Acesse `login.html`
2. Clique em "Criar uma conta"
3. Preencha email e senha
4. Verifique se foi redirecionado para `area-cliente.html`

### Teste 2: Status de Login
1. Vá para `index.html`
2. Veja se aparece "👤 [seu nome]" no menu superior
3. Clique para ir para área do cliente

### Teste 3: Fazer Orçamento
1. Adicione produtos ao carrinho
2. Vá para `carrinho.html`
3. Seus dados devem estar preenchidos automaticamente
4. Gere o PDF
5. Vá para `area-cliente.html` e veja o orçamento no histórico

### Teste 4: Logout e Login
1. Clique em "Sair" no menu
2. Vá para `login.html`
3. Faça login novamente
4. Seus dados e histórico devem estar lá!

---

## ⚠️ MODO LOCAL (DESENVOLVIMENTO)

Se você **ainda não configurou o Google Apps Script**, o sistema funciona em "modo local":
- Login funciona localmente (só no seu navegador)
- Orçamentos NÃO são salvos na nuvem
- Dados ficam apenas no `localStorage`

**Para produção, é ESSENCIAL configurar o Google Apps Script!**

---

## 🆘 PROBLEMAS COMUNS

### "Email ou senha incorretos" ao criar conta
- Verifique se configurou a URL do Apps Script em `auth.js`
- Verifique se as abas `clientes` e `orcamentos` existem na planilha
- Abra o Console (F12) e veja erros

### Botão de login não aparece no menu
- Verifique se adicionou `<script src="auth.js"></script>` na página
- Deve estar ANTES do `script.js`

### Orçamentos não aparecem no histórico
- Verifique se está logado
- Verifique se gerou o PDF do orçamento (isso salva automaticamente)
- Abra a aba `orcamentos` no Google Sheets para ver se salvou

### Console mostra "CORS error"
- Normal! O Apps Script usa modo `no-cors`
- O sistema tenta fazer login mesmo com esse "erro"
- Se login funcionar, está tudo certo

---

## 📞 PRÓXIMOS PASSOS

Após ativar o sistema:

1. **Divulgue para clientes** - Envie o link `login.html` 
2. **Adicione link no site** - Coloque botão "Área do Cliente" na home
3. **Teste com clientes reais** - Peça feedback
4. **Monitore a planilha** - Veja clientes cadastrados e orçamentos

---

## 🎯 RECURSOS OPCIONAIS (FUTURO)

Melhorias que podem ser adicionadas depois:
- Recuperação de senha por email
- Notificações quando orçamento é aprovado
- Upload de documentos (CNPJ, etc)
- Status "Em análise", "Aprovado", "Enviado"
- Chat integrado

---

**Documentação completa:** Veja `GUIA_SISTEMA_LOGIN.md`

Dúvidas? Leia a documentação ou veja o Console do navegador (F12) para erros.
