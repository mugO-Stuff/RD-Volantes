# 🚀 Como Fazer Merge no Netlify

## 📋 Situação Atual

Você tem as alterações na branch `copilot/update-sheet-loading-method` e precisa fazer merge para a branch principal (geralmente `main` ou `master`) para que o Netlify publique automaticamente.

## ✅ Opção 1: Via GitHub (RECOMENDADO - Mais Fácil)

### Passo 1: Criar Pull Request no GitHub

1. Acesse: `https://github.com/mugO-Stuff/RD-Volantes`

2. Você verá uma notificação amarela assim:
   ```
   copilot/update-sheet-loading-method had recent pushes
   [Compare & pull request]
   ```

3. Clique em **"Compare & pull request"**

4. Preencha o Pull Request:
   - **Título:** "Adicionar diagnóstico OpenSheet API e corrigir carregamento no Netlify"
   - **Descrição:** Cole o conteúdo do arquivo `RESUMO.md` ou escreva:
   ```
   - Adiciona ferramenta de diagnóstico (test-sheets.html)
   - Adiciona logs detalhados para debug
   - Melhora mensagens de erro
   - Adiciona documentação completa em português
   ```

5. Clique em **"Create pull request"**

### Passo 2: Fazer Merge

1. Na página do Pull Request, clique em **"Merge pull request"**

2. Confirme clicando em **"Confirm merge"**

3. Pronto! O Netlify vai detectar automaticamente e fazer deploy em poucos minutos

---

## ✅ Opção 2: Via Linha de Comando (Git)

Se você preferir usar terminal/linha de comando:

```bash
# 1. Ir para a branch principal
git checkout main
# OU se sua branch principal for master:
# git checkout master

# 2. Fazer merge da branch de alterações
git merge copilot/update-sheet-loading-method

# 3. Enviar para GitHub
git push origin main
# OU se for master:
# git push origin master
```

O Netlify detectará automaticamente e fará deploy.

---

## 🔍 Como Saber se o Deploy Funcionou?

### No Netlify:

1. Acesse: `https://app.netlify.com`
2. Entre na conta
3. Selecione o site "RD-Volantes"
4. Vá em **"Deploys"**
5. Você verá:
   - 🟡 **"Building"** (amarelo) = Ainda processando
   - 🟢 **"Published"** (verde) = Deploy concluído!
   - 🔴 **"Failed"** (vermelho) = Erro no deploy

### No GitHub:

1. Vá em **"Actions"** no repositório
2. Você verá o workflow de deploy rodando
3. Espere ficar verde ✅

---

## 🧪 Testar Após Deploy

1. Acesse: `https://SEU-SITE.netlify.app/test-sheets.html`

2. Clique nos botões para testar cada aba

3. Se der **verde ✅**: Funcionou!

4. Se der **vermelho ❌**: Veja a mensagem de erro e siga as instruções

---

## ⚠️ IMPORTANTE: Configurações do Netlify

Verifique se o Netlify está configurado para fazer deploy automático:

### Passo 1: Acessar Configurações

1. Entre em `https://app.netlify.com`
2. Selecione o site "RD-Volantes"
3. Vá em **"Site settings"** → **"Build & deploy"**

### Passo 2: Verificar Branch de Deploy

Em **"Continuous Deployment"** → **"Branch deploys"**, verifique:

- ✅ **Branch to deploy:** `main` (ou `master`)
- ✅ **Deploy previews:** Ativo

### Passo 3: Verificar Build Settings

Em **"Build settings"**, deve estar:

- **Build command:** (vazio ou nenhum - é um site estático)
- **Publish directory:** `/` ou `.` (raiz do projeto)

---

## 🎯 Resumo Rápido

**Jeito Mais Fácil (GitHub Web):**
1. Ir em `github.com/mugO-Stuff/RD-Volantes`
2. Clicar em "Compare & pull request"
3. Clicar em "Create pull request"
4. Clicar em "Merge pull request"
5. Esperar 2-5 minutos
6. Acessar `seu-site.netlify.app/test-sheets.html`

**Pronto!** 🎉

---

## 🆘 Problemas Comuns

### "Não vejo o botão Compare & pull request"

1. Vá em **"Pull requests"**
2. Clique em **"New pull request"**
3. Escolha:
   - **Base:** `main` (ou `master`)
   - **Compare:** `copilot/update-sheet-loading-method`
4. Clique em **"Create pull request"**

### "Deploy não acontece automaticamente"

1. Verifique em **Netlify → Site settings → Build & deploy**
2. Certifique-se que "Branch deploys" está ativo
3. Verifique se a branch correta está selecionada

### "Deploy falhou (vermelho)"

1. Clique no deploy que falhou
2. Veja os logs de erro
3. Geralmente é problema de configuração, não do código

---

## 📞 Precisa de Ajuda?

Se tiver algum problema, compartilhe:
- Screenshot da tela do GitHub
- Screenshot dos logs do Netlify (se der erro)
- URL do seu site no Netlify

---

**Boa sorte com o deploy! 🚀**
