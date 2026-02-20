# 🔧 Como Corrigir o Erro de CORS

## ❌ O Problema
O navegador está bloqueando as requisições ao Google Apps Script por causa de CORS.

---

## ✅ Solução em 3 Passos:

### 1️⃣ Atualizar o Google Apps Script

1. Abra sua planilha do Google Sheets
2. Vá em **Extensões → Apps Script**
3. **APAGUE TODO** o código antigo
4. Abra o arquivo `google-apps-script.js` aqui no VS Code
5. **COPIE TODO** o código atualizado
6. **COLE** no Apps Script
7. **Salve** (Ctrl+S)

### 2️⃣ Reimplantar o Web App

⚠️ **IMPORTANTE:** Você precisa criar uma NOVA implantação!

1. No Apps Script, clique em **Implantar → Gerenciar implantações**
2. Clique no **ícone de lápis** ✏️ na implantação existente
3. Clique em **Nova versão** (no topo)
4. Clique em **Implantar**
5. **NÃO precisa copiar nova URL** - a URL continua a mesma!

### 3️⃣ Testar Novamente

1. Feche completamente o navegador
2. Abra novamente
3. Vá para `login.html`
4. Tente criar uma conta

---

## 🧪 Teste Rápido da API

Antes de testar o login, veja se a API está funcionando:

1. Copie a URL do seu Apps Script
2. Cole no navegador
3. Você deve ver algo como:
   ```json
   {
     "status": "ok",
     "mensagem": "API RD Volantes funcionando!",
     "versao": "1.0"
   }
   ```

Se ver isso, **a API está funcionando!** ✅

---

## 🔍 O Que Foi Alterado?

### No `auth.js`:
- ✅ Mudamos de POST para GET no login (mais compatível com CORS)
- ✅ Removemos mensagens de erro técnicas

### No `google-apps-script.js`:
- ✅ Função `doGet()` agora processa login
- ✅ Suporte para requisições GET e POST
- ✅ Melhor tratamento de erros

---

## 📋 Checklist

Antes de testar:

- [ ] Atualizei o código no Apps Script
- [ ] Salvei no Apps Script (Ctrl+S)
- [ ] Reimplantei (Nova versão)
- [ ] Testei a URL no navegador (deve mostrar JSON)
- [ ] Fechei e reabri o navegador
- [ ] Tentei criar conta novamente

---

## ⚠️ Se Ainda Der Erro

### Erro: "Failed to fetch"
**Solução:** A URL do Apps Script está errada ou a implantação não foi feita.
- Verifique se a URL em `auth.js` linha 9 está correta
- Verifique se reimplantou o Apps Script

### Erro: "Email ou senha incorretos"
**Solução:** Ótimo! A API está funcionando! 🎉
- Se for login: verifique email/senha
- Se for cadastro: pode já existir essa conta

### Erro de CORS ainda aparece
**Solução:** 
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Ou teste em aba anônima (Ctrl+Shift+N)
3. Ou teste em outro navegador

### Nada acontece
**Solução:** Abra o Console (F12) e me mande os erros

---

## 💡 Dica Pro

Teste SEMPRE primeiro a URL da API no navegador antes de testar o login!

Se a URL mostrar o JSON, significa que está tudo OK. 👍
