# 📝 Exemplos: Como Adicionar o Sistema de Login nas Páginas

Este arquivo mostra exemplos práticos de como adicionar o `auth.js` em cada página HTML do site.

---

## 🎯 Regra Geral

Adicione esta linha **ANTES** do `script.js` em todas as páginas HTML:

```html
<script src="auth.js"></script>
```

---

## 📄 Exemplo: index.html

**ANTES:**
```html
    </footer>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

**DEPOIS:**
```html
    </footer>
    <script src="auth.js"></script>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

---

## 📄 Exemplo: psdpass.html

**ANTES:**
```html
    </footer>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

**DEPOIS:**
```html
    </footer>
    <script src="auth.js"></script>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

---

## 📄 Exemplo: categoria-passeio.html

**ANTES:**
```html
    </footer>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

**DEPOIS:**
```html
    </footer>
    <script src="auth.js"></script>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

---

## 📄 Exemplo: categoria-cubos.html

**ANTES:**
```html
    </footer>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

**DEPOIS:**
```html
    </footer>
    <script src="auth.js"></script>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

---

## 📄 Exemplo: tampas.html

**ANTES:**
```html
    </footer>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

**DEPOIS:**
```html
    </footer>
    <script src="auth.js"></script>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

---

## 📄 Exemplo: outros.html

**ANTES:**
```html
    </footer>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

**DEPOIS:**
```html
    </footer>
    <script src="auth.js"></script>
    <script src="script.js?v=202602192"></script>
</body>
</html>
```

---

## ✅ Página Já Configurada: carrinho.html

Esta página JÁ foi atualizada com o sistema de login! Não precisa fazer nada.

```html
<!-- incluir biblioteca jsPDF antes do script principal -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="auth.js"></script>
<script src="script.js?v=202602192"></script>
```

---

## 🔍 Como Encontrar o Local Correto

1. Abra o arquivo HTML no editor
2. Use Ctrl+F (ou Cmd+F no Mac) para buscar: `script.js`
3. Você vai encontrar algo como: `<script src="script.js?v=..."></script>`
4. Adicione uma linha ACIMA com: `<script src="auth.js"></script>`
5. Salve o arquivo

---

## 🎨 Resultado Visual

Depois de adicionar em todas as páginas, o menu superior vai mostrar:

### Quando NÃO logado:
```
[ Principal ] [ Contato ] [ 🔐 Entrar ]
```

### Quando logado:
```
[ Principal ] [ Contato ] [ 👤 João Silva ] [ Sair ]
```

---

## ⚠️ IMPORTANTE

- O `auth.js` deve estar na **mesma pasta** que os arquivos HTML
- Deve vir **ANTES** do `script.js`
- Se você tem versionamento (`?v=202602192`), não precisa adicionar no `auth.js`

---

## 🧪 Testando

Depois de adicionar em uma página:

1. Abra a página no navegador
2. Faça login em `login.html`
3. Volte para a página que você editou
4. Veja se aparece **"👤 [seu nome]"** no menu
5. Se aparecer, está funcionando! ✅

---

## 🛠️ Script de Automação (PowerShell)

Se quiser automatizar a adição do `auth.js` em todas as páginas, pode usar este script:

```powershell
# ATENÇÃO: Faça backup antes de executar!

$arquivos = @(
    "index.html",
    "psdpass.html",
    "categoria-passeio.html",
    "categoria-cubos.html",
    "tampas.html",
    "outros.html"
)

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        $conteudo = Get-Content $arquivo -Raw
        
        # Adicionar auth.js antes de script.js
        $conteudo = $conteudo -replace '(<script src="script\.js)', '<script src="auth.js"></script>`n    $1'
        
        Set-Content $arquivo $conteudo -NoNewline
        Write-Host "✅ Atualizado: $arquivo"
    } else {
        Write-Host "⚠️  Arquivo não encontrado: $arquivo"
    }
}

Write-Host "`n✨ Concluído! Verifique os arquivos."
```

**Como usar:**
1. Salve este código em um arquivo `adicionar-auth.ps1`
2. Abra PowerShell na pasta do projeto
3. Execute: `.\adicionar-auth.ps1`

---

## ✅ Checklist Final

Depois de adicionar em todas as páginas, verifique:

- [ ] `index.html` - adicionado `auth.js`
- [ ] `psdpass.html` - adicionado `auth.js`
- [ ] `categoria-passeio.html` - adicionado `auth.js`
- [ ] `categoria-cubos.html` - adicionado `auth.js`
- [ ] `tampas.html` - adicionado `auth.js`
- [ ] `outros.html` - adicionado `auth.js`
- [x] `carrinho.html` - JÁ tem `auth.js` ✅
- [x] `login.html` - JÁ tem `auth.js` ✅
- [x] `area-cliente.html` - JÁ tem `auth.js` ✅

---

Pronto! Com isso o sistema de login estará disponível em todas as páginas do site. 🎉
