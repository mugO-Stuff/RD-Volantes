# 📊 Estrutura da Planilha Google Sheets - RD Volantes

## Aba: `clientes`

A planilha de clientes foi expandida para suportar dados completos de Pessoa Física e Pessoa Jurídica, incluindo endereço completo e endereço da transportadora.

### Colunas (A até AI):

| Coluna | Nome do Campo | Descrição | Obrigatório |
|--------|--------------|-----------|-------------|
| **A** | `id` | ID único do cliente (gerado automaticamente) | ✅ |
| **B** | `email` | E-mail de login | ✅ |
| **C** | `senha` | Senha hash (SHA-256) | ✅ |
| **D** | `razao_social` | Razão Social da empresa | ✅ |
| **E** | `cnpj` | CNPJ (para PJ) | ❌ |
| **F** | `telefone` | Telefone de contato | ❌ |
| **G** | `data_cadastro` | Data de cadastro (ISO) | ✅ |
| **H** | `fantasia` | Nome fantasia | ❌ |
| **I** | `codigo` | Código do cliente | ❌ |
| **J** | `tipo_pessoa` | Tipo: "fisica" ou "juridica" | ❌ |
| **K** | `cpf` | CPF (para PF) | ❌ |
| **L** | `rg` | RG (para PF) | ❌ |
| **M** | `orgao_emissor` | Órgão emissor do RG (ex: SSP/SP) | ❌ |
| **N** | `inscricao_estadual_pf` | Inscrição Estadual (PF) | ❌ |
| **O** | `regime_tributario` | Código de regime tributário (PJ) | ❌ |
| **P** | `inscricao_estadual` | Inscrição Estadual (PJ) | ❌ |
| **Q** | `inscricao_municipal` | Inscrição Municipal (PJ) | ❌ |
| **R** | `ie_isento` | IE Isento: "sim" ou "nao" (PJ) | ❌ |
| **S** | `cliente_desde` | Data início como cliente | ❌ |
| **T** | `contribuinte` | Tipo de contribuinte (1, 2, 9) | ❌ |
| **U** | `cep` | CEP do endereço | ❌ |
| **V** | `uf` | Estado (sigla, ex: SP) | ❌ |
| **W** | `cidade` | Nome da cidade | ❌ |
| **X** | `bairro` | Nome do bairro | ❌ |
| **Y** | `endereco` | Logradouro (Rua, Av.) | ❌ |
| **Z** | `numero` | Número do endereço | ❌ |
| **AA** | `complemento` | Complemento (apto, sala, etc.) | ❌ |
| **AB** | `transp_cep` | CEP da transportadora | ❌ |
| **AC** | `transp_uf` | UF da transportadora | ❌ |
| **AD** | `transp_cidade` | Cidade da transportadora | ❌ |
| **AE** | `transp_bairro` | Bairro da transportadora | ❌ |
| **AF** | `transp_endereco` | Endereço da transportadora | ❌ |
| **AG** | `transp_numero` | Número da transportadora | ❌ |
| **AH** | `transp_complemento` | Complemento da transportadora | ❌ |

### Cabeçalho da planilha (linha 1):

```
id | email | senha | razao_social | cnpj | telefone | data_cadastro | fantasia | codigo | tipo_pessoa | cpf | rg | orgao_emissor | inscricao_estadual_pf | regime_tributario | inscricao_estadual | inscricao_municipal | ie_isento | cliente_desde | contribuinte | cep | uf | cidade | bairro | endereco | numero | complemento | transp_cep | transp_uf | transp_cidade | transp_bairro | transp_endereco | transp_numero | transp_complemento
```

---

## Aba: `orcamentos`

Estrutura permanece a mesma:

| Coluna | Nome do Campo | Descrição |
|--------|--------------|-----------|
| **A** | `id` | ID único do orçamento |
| **B** | `cliente_id` | ID do cliente (FK) |
| **C** | `data` | Data/hora do orçamento |
| **D** | `total_itens` | Número total de itens |
| **E** | `observacao` | Observações do cliente |
| **F** | `status` | Status do orçamento |
| **G** | `itens_json` | JSON com lista de itens |

---

## 🔄 Como Configurar a Planilha

### Opção 1: Adicionar colunas manualmente

1. Abra sua planilha do Google Sheets: https://docs.google.com/spreadsheets/d/1hlkmU8txN3b_CGw1OKJVeNaqUAaOZ4tGQsdM3J4QYok
2. Na aba `clientes`, adicione os cabeçalhos das colunas **H até AA** conforme a tabela acima
3. Os clientes existentes continuarão funcionando normalmente (retrocompatível)
4. Novos dados serão salvos nas novas colunas

### Opção 2: Criar nova planilha com estrutura completa

Se preferir começar do zero:

1. Crie uma nova planilha no Google Sheets
2. Crie duas abas: `clientes` e `orcamentos`
3. Na aba `clientes`, cole o cabeçalho completo (linha acima)
4. Na aba `orcamentos`, cole: `id | cliente_id | data | total_itens | observacao | status | itens_json`
5. Atualize o `SPREADSHEET_ID` no arquivo `google-apps-script.js` com o ID da nova planilha
6. Reimplante o Apps Script

---

## 📝 Exemplo de Dados - Pessoa Física

```
CLI_1234567890_abc123 | joao@email.com | hash... | João Silva | | (11) 98765-4321 | 2026-02-20T10:00:00Z | | CLI001 | fisica | 123.456.789-00 | 12.345.678-9 | SSP/SP | | | | | | 2020-01-15 | 9 | 01234-567 | SP | São Paulo | Centro | Rua ABC | 123 | Apto 45 | 01234-567 | SP | São Paulo | Centro | Rua XYZ | 456 | Bloco A
```

## 📝 Exemplo de Dados - Pessoa Jurídica

```
CLI_9876543210_xyz789 | empresa@email.com | hash... | Empresa XYZ LTDA | 12.345.678/0001-90 | (11) 3333-4444 | 2026-02-20T11:00:00Z | XYZ Comércio | CLI002 | juridica | | | | | 1 | 123.456.789.012 | 12345678 | nao | 2019-05-20 | 1 | 01234-567 | SP | São Paulo | Itaim Bibi | Av. Paulista | 1000 | Sala 12 | 01234-567 | SP | Guarulhos | Santo André | Rua Logística | 2000 | Galpão 3
```

---

## ⚠️ Importante

- **Não altere as colunas A-G** - são essenciais para retrocompatibilidade
- **Novos campos são opcionais** - o sistema funciona mesmo sem preenchê-los
- **Backup**: Faça uma cópia da planilha antes de adicionar colunas
- **Teste**: Crie um cliente de teste após adicionar as colunas

---

## 🚀 Próximos Passos

1. ✅ Adicione as novas colunas na planilha Google Sheets
2. ✅ Copie o código atualizado de `google-apps-script.js` para o Apps Script
3. ✅ Reimplante o Apps Script (Nova implantação)
4. ✅ Teste o cadastro/login de um novo cliente
5. ✅ Acesse a Área do Cliente e preencha os dados do perfil
6. ✅ Verifique se os dados foram salvos na planilha

---

**Dúvidas?** Todos os campos novos são **opcionais** e não vão quebrar clientes existentes! 🎉
