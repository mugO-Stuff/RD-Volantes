# 🚨 LEIA PRIMEIRO - Ações Rápidas

## 🎯 Problema
A planilha não está carregando no Netlify.

## ⚡ Solução Rápida (5 minutos)

### 1️⃣ Acesse a Página de Teste
```
https://SEU-SITE.netlify.app/test-sheets.html
```
(Troque SEU-SITE pelo nome do seu site)

### 2️⃣ Clique nos Botões
Teste cada aba:
- Testar 'passeio'
- Testar 'pesado'  
- Testar 'cubos'
- etc.

### 3️⃣ Veja o Resultado

#### ✅ SE VERDE (Sucesso):
Veja os **nomes das colunas** retornados.

Exemplo:
```
Colunas encontradas:
• Código
• Descrição  
• Preço
```

#### ❌ SE VERMELHO (Erro):

**"HTTP 403: Forbidden"**
→ Planilha está privada
→ **SOLUÇÃO:** Compartilhar → "Qualquer pessoa com o link"

**"HTTP 404: Not Found"**
→ Nome da aba errado
→ **SOLUÇÃO:** Verificar nome exato da aba

**"0 linhas retornadas"**
→ Aba vazia OU nomes de colunas errados
→ **SOLUÇÃO:** Ver próximo passo

### 4️⃣ Verificar Nomes das Colunas

**IMPORTANTE:** A primeira linha da planilha deve ter:

Para **passeio** e **pesado**:
```
codigo | descricao | preco | imagem | sugeridoPara
```

Para **cubos**:
```
codigo | descricao | preco | imagem | cores | categoria
```

Para **tampas**:
```
codigo | descricao | preco
```

Para **variados**:
```
codigo | categoria | descricao | preco | cores
```

Para **lancamentos**:
```
tipo | url | ordem
```

**ATENÇÃO:** 
- ✅ Pode ser tudo minúsculo: `codigo`, `descricao`, `preco`
- ✅ OU com maiúscula: `Codigo`, `Descricao`, `Preco`
- ❌ NÃO pode ter espaços ou acentos

### 5️⃣ Ver Logs no Navegador (Opcional)

1. Abra qualquer página do catálogo
2. Pressione **F12**
3. Vá em **Console**
4. Procure mensagens com emojis (🔄 📡 📊 ✅ ❌)

## 📚 Documentação Completa

- **RESUMO.md** - Instruções detalhadas
- **DIAGNOSTICO.md** - Guia de troubleshooting completo
- **test-sheets.html** - Ferramenta de teste

## 💡 Dica Final

A ferramenta de teste (**test-sheets.html**) mostra EXATAMENTE:
- ✅ Se a API está funcionando
- ✅ Quantas linhas foram retornadas
- ✅ Os nomes das colunas encontrados
- ✅ Exemplo da primeira linha

**Use ela PRIMEIRO** antes de modificar qualquer código!

---

## ⚡ TL;DR (Resumão)

1. Acesse `test-sheets.html` no Netlify
2. Clique nos botões para testar
3. Se vermelho → veja a mensagem de erro
4. Se verde mas "0 produtos" → verifique nomes das colunas
5. Colunas devem ser: `codigo`, `descricao`, `preco`, etc.

**Pronto!** 🎉
