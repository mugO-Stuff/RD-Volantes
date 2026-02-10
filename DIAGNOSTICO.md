# 🔧 Guia de Diagnóstico - Planilha não Carrega no Netlify

## 🎯 Problema
A planilha do Google Sheets não está carregando no site hospedado no Netlify após migração para OpenSheet API.

## 📋 Checklist de Diagnóstico

### 1️⃣ Testar Conexão com OpenSheet API

Acesse no Netlify: `https://SEU-SITE.netlify.app/test-sheets.html`

(Substitua `SEU-SITE` pelo nome do seu site no Netlify)

Esta página irá:
- ✅ Testar cada aba da planilha
- ✅ Mostrar quantas linhas foram retornadas
- ✅ Exibir os nomes das colunas encontradas
- ✅ Mostrar erros de conexão (se houver)

### 2️⃣ Verificar Nomes das Colunas

**IMPORTANTE:** O OpenSheet API usa os **nomes das colunas** (primeira linha) como propriedades do JSON.

#### ✅ Nomes Esperados pelo Código:

**Aba `lancamentos`:**
```
tipo | url | ordem
```

**Abas `passeio` e `pesado`:**
```
codigo | descricao | preco | imagem | sugeridoPara
```

**Aba `cubos`:**
```
codigo | descricao | preco | imagem | cores | categoria
```

**Aba `tampas`:**
```
codigo | descricao | preco
```

**Aba `variados`:**
```
codigo | categoria | descricao | preco | cores
```

**⚠️ ATENÇÃO:**
- Os nomes devem estar **exatamente** como acima (minúsculas, sem espaços)
- OU você pode usar com letra maiúscula: `Codigo`, `Descricao`, `Preco`, etc.
- O código aceita ambos os formatos

### 3️⃣ Verificar Console do Navegador

1. Abra seu site no Netlify
2. Pressione **F12** para abrir DevTools
3. Vá na aba **Console**
4. Procure por mensagens com emojis:
   - 🔄 = Iniciando carregamento
   - 📡 = URL sendo acessada
   - 📥 = Resposta recebida
   - 📊 = Número de linhas
   - 🔍 = Exemplo da primeira linha
   - ✅ = Sucesso
   - ❌ = Erro

### 4️⃣ Problemas Comuns e Soluções

#### ❌ "0 linhas retornadas"
**Causa:** Aba vazia ou nome da aba incorreto
**Solução:** 
- Verifique se há dados na aba
- Confirme o nome exato da aba (case-sensitive)

#### ❌ "Nenhum produto encontrado"
**Causa:** Nomes de colunas não correspondem
**Solução:**
- Use `test-sheets.html` para ver os nomes das colunas retornados
- Compare com os nomes esperados acima
- Renomeie as colunas na planilha OU ajuste o código

#### ❌ "HTTP 404: Not Found"
**Causa:** Nome da aba não existe ou ID da planilha errado
**Solução:**
- Verifique o ID da planilha no `script.js`
- Confirme que a aba existe com o nome correto

#### ❌ "HTTP 403: Forbidden"
**Causa:** Planilha não está pública
**Solução:**
1. Abra a planilha no Google Sheets
2. Clique em **Compartilhar** (canto superior direito)
3. Altere para **"Qualquer pessoa com o link"**
4. Permissão: **Leitor**
5. Copie o link e teste novamente

#### ❌ "Failed to fetch" ou "Network error"
**Causa:** Problema de CORS ou rede
**Solução:**
- OpenSheet normalmente resolve CORS automaticamente
- Verifique se está acessando via HTTPS (não HTTP)
- Tente limpar cache do navegador

### 5️⃣ Exemplo de Como Corrigir Colunas

**Antes (ERRADO):**
```
Código | Descrição | Preço | Imagem
```

**Depois (CORRETO - opção 1):**
```
codigo | descricao | preco | imagem
```

**Depois (CORRETO - opção 2):**
```
Codigo | Descricao | Preco | Imagem
```

**Ambas as opções funcionam!** O código aceita lowercase ou capitalized.

## 🧪 Como Usar test-sheets.html

1. Deploy no Netlify (já está incluído)
2. Acesse: `https://SEU-SITE.netlify.app/test-sheets.html` (substitua SEU-SITE)
3. Clique nos botões para testar cada aba
4. Observe:
   - ✅ Verde = Sucesso
   - ❌ Vermelho = Erro
5. Veja os nomes das colunas retornadas
6. Compare com os nomes esperados acima

## 📞 Se Ainda Não Funcionar

Compartilhe:
1. Screenshot do `test-sheets.html` mostrando o erro
2. Screenshot do Console (F12) mostrando os logs
3. Link da planilha do Google Sheets (com permissão de leitura)
4. URL do site no Netlify

## ✅ Checklist de Verificação Final

- [ ] Planilha está pública ("Qualquer pessoa com o link")
- [ ] IDs das planilhas estão corretos em `script.js`
- [ ] Nomes das abas estão corretos (lancamentos, passeio, pesado, etc.)
- [ ] Nomes das colunas seguem o padrão esperado
- [ ] `test-sheets.html` mostra dados quando testado
- [ ] Console não mostra erros 404 ou 403
- [ ] Site está acessado via HTTPS (não HTTP)

---

💡 **Dica:** Use sempre `test-sheets.html` primeiro para diagnosticar problemas antes de investigar o código!
