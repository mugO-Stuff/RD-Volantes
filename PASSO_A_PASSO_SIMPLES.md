# 🎯 GUIA SUPER SIMPLES - Configure em 10 Minutos!

Vou te guiar passo a passo. Siga EXATAMENTE esta ordem:

---

## ✅ ETAPA 1: Pegar o ID da Planilha (2 minutos)

1. **Abra sua planilha** para EDITAR (não visualizar)
2. Olhe para a **URL** no navegador. Vai estar assim:
   ```
   https://docs.google.com/spreadsheets/d/1hlkmU8txN3b_CGw1OKJVeNaqUAaOZ4tGQsdM3J4QYok/edit
                                           └──────────────────────────────────────┘
                                                    ESTE É O ID!
   ```

3. **Copie** apenas a parte entre `/d/` e `/edit`

**No seu caso, parece ser:** `1hlkmU8txN3b_CGw1OKJVeNaqUAaOZ4tGQsdM3J4QYok`

Se for outro, use o da sua URL!

---

## ✅ ETAPA 2: Configurar o Apps Script (5 minutos)

### Passo 2.1 - Abrir o Editor
1. Na sua planilha, clique em **Extensões** (menu superior)
2. Clique em **Apps Script**
3. Uma nova aba vai abrir com um editor de código

### Passo 2.2 - Colar o Código
1. **APAGUE** todo código que já está lá (geralmente tem uma função `myFunction()`)
2. Abra o arquivo `google-apps-script.js` aqui no VS Code
3. **COPIE TODO** o conteúdo
4. **COLE** no editor do Apps Script

### Passo 2.3 - Atualizar o ID
No código que você colou, procure a linha 13:
```javascript
const SPREADSHEET_ID = '1hlkmU8txN3b_CGw1OKJVeNaqUAaOZ4tGQsdM3J4QYok';
```

Se o ID for diferente do seu, substitua pelo ID que você copiou na Etapa 1.

### Passo 2.4 - Salvar
1. Clique no ícone de **disquete** 💾 (ou Ctrl+S)
2. Se pedir nome do projeto, coloque: **RD Volantes API**

---

## ✅ ETAPA 3: Implantar (3 minutos)

### Passo 3.1 - Nova Implantação
1. Clique em **Implantar** (canto superior direito, botão azul)
2. Escolha **Nova implantação**

### Passo 3.2 - Configurar Tipo
1. Clique no ícone de ⚙️ **engrenagem** ao lado de "Selecione o tipo"
2. Escolha **Aplicativo da Web**

### Passo 3.3 - Configurações Importantes
Preencha assim (EXATAMENTE):

- **Descrição:** `API RD Volantes`
- **Executar como:** **Eu** (seu email)
- **Quem tem acesso:** **Qualquer pessoa**

### Passo 3.4 - Autorizar
1. Clique em **Implantar**
2. Vai aparecer um aviso de segurança
3. Clique em **Autorizar acesso**
4. Escolha sua conta Google
5. Clique em **Avançado** (embaixo)
6. Clique em **Ir para RD Volantes API (não seguro)**
7. Clique em **Permitir**

### Passo 3.5 - COPIAR A URL
Depois de implantar, vai aparecer uma tela com:

```
URL da Web App:
https://script.google.com/macros/s/AKfycby...muito-texto.../exec
                                        └─────────────────────┘
                                         COPIE TUDO ISSO!
```

⚠️ **SUPER IMPORTANTE:** Selecione e copie TODA a URL (ela é bem longa!)

---

## ✅ ETAPA 4: Colar a URL no Site (1 minuto)

1. Volte aqui no VS Code
2. Abra o arquivo `auth.js`
3. Vá na **linha 10**
4. Vai estar assim:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'COLE_SUA_URL_AQUI';
   ```

5. Substitua `COLE_SUA_URL_AQUI` pela URL que você copiou:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby...../exec';
   ```

6. Salve o arquivo (Ctrl+S)

---

## ✅ ETAPA 5: Adicionar o Script nas Páginas (2 minutos)

Você precisa adicionar uma linha em cada página HTML.

### Jeito Manual:
Abra cada arquivo abaixo e adicione esta linha ANTES do `script.js`:

```html
<script src="auth.js"></script>
```

**Arquivos para editar:**
- [ ] `index.html`
- [ ] `psdpass.html`
- [ ] `categoria-passeio.html`
- [ ] `categoria-cubos.html`
- [ ] `tampas.html`
- [ ] `outros.html`

### Jeito Automático (PowerShell):
Se preferir, abra o PowerShell na pasta do projeto e execute:

```powershell
# Adicionar auth.js automaticamente
$arquivos = @("index.html", "psdpass.html", "categoria-passeio.html", "categoria-cubos.html", "tampas.html", "outros.html")

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        $conteudo = Get-Content $arquivo -Raw
        if ($conteudo -notmatch 'auth\.js') {
            $conteudo = $conteudo -replace '(\s*<script src="script\.js)', "`n    <script src=`"auth.js`"></script>$1"
            Set-Content $arquivo $conteudo -NoNewline
            Write-Host "✅ $arquivo - adicionado"
        } else {
            Write-Host "⏭️  $arquivo - já tem auth.js"
        }
    }
}
```

---

## ✅ ETAPA 6: Testar! (2 minutos)

1. Abra o site no navegador
2. Vá para `login.html`
3. Clique em **"Criar uma conta"**
4. Preencha:
   - Email: seu email
   - Senha: qualquer senha (min 6 caracteres)
5. Clique em **"Criar Conta"**

### ✅ Deu certo se:
- Você foi redirecionado para `area-cliente.html`
- Aparece seu nome no topo
- No menu aparece "👤 [seu nome]"

### ❌ Deu erro se:
- Aparecer "Email já cadastrado" - normal, tente fazer login
- Aparecer erro de API - volte na Etapa 4 e verifique a URL
- Nada acontecer - abra o Console (F12) e me mande os erros

---

## 🎉 PRONTO!

Agora teste fazer um orçamento:
1. Adicione produtos ao carrinho
2. Vá para `carrinho.html`
3. Seus dados já vão estar preenchidos!
4. Gere o PDF
5. Volte para `area-cliente.html`
6. Veja seu orçamento no histórico!

---

## 🔍 Verificando se Salvou no Google Sheets

1. Volte para sua planilha do Google Sheets
2. Clique na aba **clientes**
3. Você deve ver seu cadastro lá!
4. Clique na aba **orcamentos**
5. Depois de gerar um PDF, o orçamento deve aparecer aqui!

---

## ❓ PROBLEMAS COMUNS

### "Não consigo encontrar Extensões"
- Você está na planilha do Google Sheets?
- O menu fica no topo: Arquivo | Editar | Exibir | Inserir | Formato | Dados | Ferramentas | **Extensões**

### "Não aparece opção de Implantar"
- Você salvou o código? (ícone 💾)
- Tente fechar e abrir o Apps Script novamente

### "Erro ao autorizar"
- Normal! Clique em "Avançado" e depois "Ir para RD Volantes API"
- É sua própria planilha, é seguro autorizar

### "URL não funciona"
- Verifique se copiou a URL COMPLETA (incluindo `/exec` no final)
- Verifique se colocou entre aspas: `'sua-url-aqui'`
- Certifique-se que não tem espaços antes ou depois

### "Login não funciona"
- Abra o Console do navegador (F12)
- Vá na aba "Console"
- Me mande uma print dos erros que aparecem

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionar:
1. Abra o navegador (Chrome/Edge)
2. Abra a página que deu erro
3. Pressione **F12**
4. Clique em **Console**
5. Me mande print dos erros em vermelho

---

**Dica:** Siga exatamente nesta ordem. Não pule nenhuma etapa! ✅
