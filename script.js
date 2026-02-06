console.log('Script carregado!');
const GOOGLE_SHEETS_ID = '1hlkmU8txN3b_CGw1OKJVeNaqUAaOZ4tGQsdM3J4QYok';
const GOOGLE_SHEETS_ID_LANCAMENTOS = '1xo_PUXRnlkT_VCYu0e0tndl3P4NaCvAJSV8qz61ng2E';
// =============================
// CARREGAR LANÇAMENTOS (STORIES) DA PLANILHA
// =============================
async function carregarLancamentos() {
    const container = document.querySelector('.novidades-banners');
    if (!container) {
        console.warn('Container .novidades-banners não encontrado!');
        return;
    }
    try {
        console.log('🔄 Buscando lançamentos do Google Sheets...');
        const dados = await carregarDadosGoogleSheets('lancamentos', GOOGLE_SHEETS_ID_LANCAMENTOS);
        console.log('Lançamentos carregados:', dados);
        container.innerHTML = '';
        if (!dados || !dados.length) {
            container.innerHTML = '<p style="color:#fff;text-align:center">Nenhum lançamento encontrado.</p>';
            console.warn('Nenhum lançamento encontrado na planilha.');
            return;
        }
        dados.forEach(item => {
            let el;
            const tipo = (item.tipo || '').toLowerCase();
            if (tipo === 'vimeo' || (item.url || '').includes('player.vimeo.com')) {
                el = document.createElement('div');
                el.className = 'novidade-banner';
                el.innerHTML = `<iframe src="${item.url}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:100%;border-radius:12px;"></iframe>`;
            } else if (tipo === 'video') {
                el = document.createElement('div');
                el.className = 'novidade-banner';
                el.innerHTML = `<video src="${item.url}" controls autoplay muted playsinline poster="${item.poster || ''}"></video>`;
            } else {
                el = document.createElement('div');
                el.className = 'novidade-banner';
                el.innerHTML = `<img src="${item.url}" alt="Lançamento">`;
            }
            container.appendChild(el);
        });
    } catch (e) {
        console.error('Erro ao carregar lançamentos:', e);
        container.innerHTML = '<p style="color:#fff;text-align:center">Não foi possível carregar os lançamentos.</p>';
    }
}
// Chama o carregamento dos lançamentos apenas no index
// Garante que carregarLancamentos sempre é chamado na index
if (document.body.classList.contains('index-page')) {
    console.log('Chamando carregarLancamentos() na index-page');
    carregarLancamentos();
}
// =============================
// LISTA DE PRODUTOS (APENAS AQUI)
// =============================
const produtos = [
    {
        id: 1,
        nome: "Produto 1",
        preco: 29.90,
        imagem: "img/produto1.jpg",
        descricao: "Descrição curta do Produto 1"
    },
    {
        id: 2,
        nome: "Produto 2",
        preco: 49.90,
        imagem: "img/produto2.jpg",
        descricao: "Descrição curta do Produto 2"
    },
    {
        id: 3,
        nome: "Produto 3",
        preco: 59.90,
        imagem: "img/produto3.jpg",
        descricao: "Descrição curta do Produto 3"
    }
];

// ===========================================================
// CARREGA PRODUTOS NA TELA (SUBSTITUI QUALQUER HTML MANUAL)
// ===========================================================
function carregarProdutos() {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";

    produtos.forEach(prod => {
        const item = document.createElement("div");
        item.classList.add("item-card");

        item.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}">
            <h3>${prod.nome}</h3>
            <p>${prod.descricao}</p>
            <span class="preco">R$ ${prod.preco.toFixed(2)}</span>
            <button onclick="adicionarAoCarrinho(${prod.id})">Adicionar ao Carrinho</button>
        `;

        catalogo.appendChild(item);
    });
}

// ==================================
// ANIMAÇÃO DO HEADER AO ROLAR
// ==================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================================
// SISTEMA DE CARRINHO UNIFICADO
// ==================================

// Helper seguro para ler/escrever carrinho
function safeGetCarrinho() {
    try {
        const raw = localStorage.getItem("carrinho");
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (err) {
        console.warn("Carrinho corrompido — resetando", err);
        localStorage.removeItem("carrinho");
        return [];
    }
}

function safeSaveCarrinho(carrinho) {
    try {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        return true;
    } catch (err) {
        console.error("Falha ao salvar carrinho", err);
        return false;
    }
}

// Animação de item voando para o carrinho
function animarParaCarrinho(img) {
    const carrinhoEl = document.querySelector("#icone-carrinho, .carrinho-flutuante");
    if (!carrinhoEl || !img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = carrinhoEl.getBoundingClientRect();

    const clone = img.cloneNode(true);
    clone.classList.add("fly-img");
    clone.style.position = "fixed";
    clone.style.left = imgRect.left + "px";
    clone.style.top = imgRect.top + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    clone.style.zIndex = "9999";
    clone.style.pointerEvents = "none";
    clone.style.transition = "transform .75s cubic-bezier(.2,.9,.2,1), opacity .6s ease";

    document.body.appendChild(clone);
    clone.getBoundingClientRect();

    const translateX = (cartRect.left + cartRect.width / 2) - (imgRect.left + imgRect.width / 2);
    const translateY = (cartRect.top + cartRect.height / 2) - (imgRect.top + imgRect.height / 2);

    requestAnimationFrame(() => {
        clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(.22)`;
        clone.style.opacity = "0";
    });

    setTimeout(() => {
        try { clone.remove(); } catch(e) {}
    }, 780);
}

// Delegação de clique para botões .btn-add-carrinho
document.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".btn-add-carrinho, .btn-add");
    if (!btn) return;

    ev.preventDefault();
    ev.stopPropagation();

    const card = btn.closest(".item-card");
    
    // Verificar se o produto tem cores disponíveis
    const coresData = btn.dataset.cores;
    if (coresData) {
        try {
            const cores = JSON.parse(coresData);
            console.log("🎨 Abrindo seletor de cores:", cores);
            mostrarPopupCores(btn, card, cores);
        } catch (e) {
            console.error("Erro ao parsear cores:", e);
            adicionarAoCarrinhoDirecto(card, btn);
        }
        return;
    }

    // Fluxo normal sem cores
    adicionarAoCarrinhoDirecto(card, btn);
});

// Função para adicionar ao carrinho (sem pop-up de cores)
function adicionarAoCarrinhoDirecto(card, btn, codigoOverride = null, corNome = null) {
    let descricao = (btn.dataset.descricao || card?.querySelector(".titulo")?.innerText || "").trim();
    let codigo = codigoOverride || (btn.dataset.codigo || card?.querySelector(".codigo")?.innerText || "").trim();
    const precoRaw = (btn.dataset.preco || card?.querySelector(".preco")?.dataset?.preco || card?.querySelector(".preco")?.innerText || "0")
        .replace(/[^\d.,]/g, "").replace(",", ".").trim();
    const preco = Number(precoRaw) || 0;
    const qtdInput = card?.querySelector(".item-qtd");
    let qtd = qtdInput ? parseInt(qtdInput.value, 10) || 1 : 1;
    if (qtd < 1) qtd = 1;
    if (!codigo) codigo = `item-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;

    // Adicionar nome da cor à descrição se existir
    if (corNome) {
        descricao = `${descricao} - ${corNome}`;
    }

    const carrinho = safeGetCarrinho();
    const existente = carrinho.find(it => it.codigo === codigo);
    
    if (existente) {
        existente.qtd = (Number(existente.qtd) || 0) + qtd;
    } else {
        carrinho.push({ codigo, descricao, preco, qtd });
    }

    if (!safeSaveCarrinho(carrinho)) {
        alert("Erro ao salvar item no carrinho.");
        return;
    }
    
    console.log("✅ Item adicionado:", { codigo, descricao, preco, qtd });

    try {
        const img = card?.querySelector("img") || card?.querySelector(".item-img");
        if (img) animarParaCarrinho(img);
    } catch (e) {}
}

// Função para adicionar cubo ao carrinho (página categoria-cubos)
function adicionarCuboAoCarrinho(codigo, descricao, preco = 0) {
    const carrinho = safeGetCarrinho();
    const existente = carrinho.find(it => it.codigo === codigo);
    preco = Number(preco) || 0;
    if (existente) {
        existente.qtd = (Number(existente.qtd) || 0) + 1;
        // Atualiza preço se for 0 e agora veio um válido
        if ((!existente.preco || existente.preco === 0) && preco > 0) {
            existente.preco = preco;
        }
    } else {
        carrinho.push({ 
            codigo: codigo, 
            descricao: descricao, 
            preco: preco, 
            qtd: 1 
        });
    }

    if (!safeSaveCarrinho(carrinho)) {
        alert("Erro ao salvar item no carrinho.");
        return;
    }
    
    console.log("✅ Cubo adicionado:", { codigo, descricao, preco });
    
    // Feedback visual
    const icone = document.getElementById('icone-carrinho');
    if (icone) {
        icone.style.transform = 'scale(1.3)';
        icone.style.background = '#28a745';
        setTimeout(() => {
            icone.style.transform = 'scale(1)';
            icone.style.background = '';
        }, 300);
    }
    
    // Toast de confirmação
    mostrarToast(`${codigo} adicionado ao carrinho!`);
}

// Toast de feedback
function mostrarToast(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast-carrinho';
    toast.textContent = mensagem;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #1e7e34);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Mostrar pop-up de seleção de cores
function mostrarPopupCores(btn, card, cores) {
    // Remover pop-up existente se houver
    document.querySelectorAll('.color-popup-overlay').forEach(p => p.remove());

    const rect = btn.getBoundingClientRect();
    
    const overlay = document.createElement('div');
    overlay.className = 'color-popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'color-popup';
    
    // Posicionar ao lado do botão
    popup.style.top = `${rect.top}px`;
    popup.style.left = `${rect.right + 10}px`;
    
    // Parar propagação de cliques no popup
    popup.addEventListener('click', (e) => e.stopPropagation());
    
    let coresHTML = cores.map(cor => `
        <button class="color-option" 
                data-codigo="${cor.codigo}" 
                data-nome="${cor.nome}"
                style="background-color: ${cor.hex};"
                title="${cor.nome}">
            <span class="color-name">${cor.nome}</span>
        </button>
    `).join('');

    popup.innerHTML = `
        <div class="color-popup-header">
            <span>Seleciona a Cor do Aplique</span>
            <button class="color-popup-close">&times;</button>
        </div>
        <div class="color-options">
            ${coresHTML}
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Ajustar posição se sair da tela
    const popupRect = popup.getBoundingClientRect();
    if (popupRect.right > window.innerWidth) {
        popup.style.left = `${rect.left - popupRect.width - 10}px`;
    }
    if (popupRect.bottom > window.innerHeight) {
        popup.style.top = `${window.innerHeight - popupRect.height - 10}px`;
    }
    
    console.log("🎨 Pop-up criado e adicionado ao DOM");

    // Fechar pop-up ao clicar no overlay (fora do popup)
    overlay.addEventListener('click', () => {
        overlay.remove();
        popup.remove();
    });

    // Fechar pop-up pelo X
    popup.querySelector('.color-popup-close').addEventListener('click', () => {
        overlay.remove();
        popup.remove();
    });

    // Selecionar cor
    popup.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            const codigoCor = option.dataset.codigo;
            const nomeCor = option.dataset.nome;
            overlay.remove();
            popup.remove();
            adicionarAoCarrinhoDirecto(card, btn, codigoCor, nomeCor);
        });
    });
}

// ==================================
// RENDERIZAÇÃO DA PÁGINA DO CARRINHO
// ==================================
function renderCarrinhoPage() {
    const container = document.getElementById("listaCarrinho") || document.getElementById("carrinho-itens");
    if (!container) return;

    const carrinho = safeGetCarrinho();
    container.innerHTML = "";

    if (!carrinho.length) {
        container.innerHTML = "<p>Carrinho vazio.</p>";
        const totalEl = document.getElementById("valorTotal");
        if (totalEl) totalEl.textContent = "R$ 0,00";
        return;
    }

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("carrinho-item");
        div.style.cssText = "display:flex; gap:12px; align-items:center; padding:12px; border-bottom:1px solid #eee;";
        div.innerHTML = `
            <span style="flex:2;">${item.descricao}</span>
            <span style="flex:1;">Código: ${item.codigo}</span>
            <input type="number" min="1" value="${item.qtd}" 
                   style="width:70px; padding:6px;"
                   onchange="updateItemQuantity('${item.codigo}', this.value)">
            <span style="flex:1;">R$ ${(Number(item.preco) || 0).toFixed(2)}</span>
            <button class="btn-remove" onclick="removeItem('${item.codigo}')">Remover</button>
        `;
        container.appendChild(div);
    });

    const total = carrinho.reduce((s, it) => s + ((Number(it.preco) || 0) * (Number(it.qtd) || 0)), 0);
    const totalEl = document.getElementById("valorTotal");
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

function updateItemQuantity(codigo, novaQtd) {
    const carrinho = safeGetCarrinho();
    const idx = carrinho.findIndex(i => i.codigo === codigo);
    if (idx === -1) return;
    carrinho[idx].qtd = Math.max(1, Number(novaQtd) || 1);
    safeSaveCarrinho(carrinho);
    renderCarrinhoPage();
}

function removeItem(codigo) {
    let carrinho = safeGetCarrinho();
    carrinho = carrinho.filter(i => i.codigo !== codigo);
    safeSaveCarrinho(carrinho);
    renderCarrinhoPage();
}

// ==================================
// GERAR PDF DO CARRINHO
// ==================================
function setupPdfButton() {
    const btnPdf = document.getElementById("btn-gerar-pdf") || document.getElementById("btnPdf");
    
    if (!btnPdf) return;
    
    btnPdf.addEventListener("click", async () => {
        const clienteNome = (document.getElementById("clienteNome")?.value || "").trim();
        const clienteCNPJ = (document.getElementById("clienteCNPJ")?.value || "").trim();
        const clienteEmail = (document.getElementById("clienteEmail")?.value || "").trim();
        const clienteTelefone = (document.getElementById("clienteTelefone")?.value || "").trim();
        const clienteObs = (document.getElementById("clienteObs")?.value || "").trim();

        if (!window.jspdf?.jsPDF) {
            alert("jsPDF não disponível.");
            return;
        }

        const carrinho = safeGetCarrinho();
        if (!carrinho.length) {
            alert("Carrinho vazio — adicione itens antes de gerar o PDF.");
            return;
        }

        // Verificação de valor mínimo
        const total = carrinho.reduce((s, it) => s + ((Number(it.preco) || 0) * (Number(it.qtd) || 0)), 0);
        if (total < 2000) {
            alert("Pedido mínimo para orçamento: R$ 2.000,00. Adicione mais itens ao carrinho para gerar o PDF.");
            return;
        }

        const doc = new window.jspdf.jsPDF();

        const marginLeft = 14;
        const colDesc = 70;
        const colQtd = 140;
        const colPreco = 170;
        let y = 18;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Orçamento", doc.internal.pageSize.getWidth() / 2, 12, { align: "center" });
        y += 6;
        doc.setFontSize(10);

        doc.setFont("courier", "normal");
        if (clienteNome) {
            doc.text(`Cliente: ${clienteNome}`, marginLeft, y);
            y += 5;
        }
        if (clienteCNPJ) {
            doc.text(`CNPJ: ${clienteCNPJ}`, marginLeft, y);
            y += 5;
        }
        if (clienteEmail) {
            doc.text(`E-mail: ${clienteEmail}`, marginLeft, y);
            y += 5;
        }
        if (clienteTelefone) {
            doc.text(`Telefone: ${clienteTelefone}`, marginLeft, y);
            y += 5;
        }
        if (clienteNome || clienteCNPJ || clienteEmail || clienteTelefone) y += 4;
        if (clienteObs) {
            doc.setFont("courier", "normal");
            doc.text("Observação:", marginLeft, y);
            y += 5;
            const obsLines = doc.splitTextToSize(clienteObs, 120);
            doc.text(obsLines, marginLeft, y);
            y += obsLines.length * 5 + 2;
        }

        doc.setFont("courier", "bold");
        doc.text("Código", marginLeft, y);
        doc.text("Descrição", colDesc, y);
        doc.text("Qtd", colQtd, y);
        doc.text("Preço", colPreco, y);
        y += 6;
        doc.setFont("courier", "normal");

        const descColWidth = colQtd - colDesc - 6;
        const lineHeight = 5;

        for (let i = 0; i < carrinho.length; i++) {
            const item = carrinho[i];
            const descricao = (item.descricao || "").replace(/\s+/g, " ").trim();
            const codigo = item.codigo || "";
            const qtd = Number(item.qtd) || 1;
            const preco = Number(item.preco) || 0;

            const descLines = doc.splitTextToSize(descricao, descColWidth);
            if (y + descLines.length * lineHeight > 277) {
                doc.addPage();
                y = 18;
            }

            doc.text(codigo, marginLeft, y);
            doc.text(descLines, colDesc, y);
            doc.text(String(qtd), colQtd, y);
            doc.text(`R$ ${preco.toFixed(2)}`, colPreco, y);

            y += descLines.length * lineHeight;
            y += 2;
        }

        doc.setFontSize(12);
        doc.text(`Total: R$ ${total.toFixed(2)}`, marginLeft, y + 8);

        // Gera nome do arquivo com data atual DD-MM-AA
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = String(hoje.getFullYear()).slice(-2);
        const nomeArquivo = `Orçamento-${dia}-${mes}-${ano}.pdf`;
        doc.save(nomeArquivo);
    });
}

// ==================================
// VÍDEO DE INTRODUÇÃO
// ==================================
function setupIntroVideo() {
    const introOverlay = document.getElementById("intro-overlay");
    const introVideo = document.getElementById("intro-video");
    
    const INTRO_LAST_KEY = "introLastShown";
    const INTRO_COOLDOWN = 2 * 60 * 1000;
    const lastShown = Number(localStorage.getItem(INTRO_LAST_KEY) || 0);
    
    if (Date.now() - lastShown < INTRO_COOLDOWN) {
        if (introOverlay) introOverlay.style.display = "none";
        if (introVideo) introVideo.style.display = "none";
    } else {
        const hideIntro = () => {
            if (introOverlay) {
                introOverlay.style.opacity = "0";
                setTimeout(() => {
                    introOverlay.style.display = "none";
                }, 600);
            }
            localStorage.setItem(INTRO_LAST_KEY, String(Date.now()));
        };

        if (introVideo) {
            introVideo.play().catch(() => {
                if (introOverlay) introOverlay.style.display = "none";
            });
            setTimeout(hideIntro, 3000);
        } else {
            setTimeout(hideIntro, 500);
        }
    }
}

// ==================================
// CONFIGURAÇÃO GOOGLE SHEETS
// ==================================

// Mapeamento: nome do catálogo → nome da aba na planilha
const SHEETS_ABAS = {
    'catalogo-passeio.json': 'passeio',
    'catalogo-pesado.json': 'pesado',
    'catalogo-cubos.json': 'cubos',
    'passeio-coloridos.json': 'coloridos',
    'catalogo-outros.json': 'variados',
    'catalogo-tampas.json': 'tampas'
};

// Define se usa Google Sheets (true) ou arquivos JSON locais (false)
const USAR_GOOGLE_SHEETS = true;

// ==================================
// FUNÇÃO PARA PARSEAR CORES (formato simplificado ou JSON)
// ==================================
function parsearCores(coresString) {
    if (!coresString) return null;
    
    const str = coresString.toString().trim();
    
    // Se começa com [ é JSON, tenta parsear
    if (str.startsWith('[')) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.warn('Erro ao parsear JSON de cores:', e);
            return null;
        }
    }
    
    // Formato simplificado: "NomeCor:Codigo:Hex, NomeCor2:Codigo2:Hex2"
    // Exemplo: "Preto:VE001PT:#000000, Cinza:VE001CZ:#808080"
    try {
        const cores = [];
        const partes = str.split(',');
        
        for (const parte of partes) {
            const [nome, codigo, hex] = parte.trim().split(':');
            if (nome && codigo && hex) {
                cores.push({
                    nome: nome.trim(),
                    codigo: codigo.trim(),
                    hex: hex.trim().startsWith('#') ? hex.trim() : '#' + hex.trim()
                });
            }
        }
        
        return cores.length > 0 ? cores : null;
    } catch (e) {
        console.warn('Erro ao parsear cores simplificadas:', e);
        return null;
    }
}

// ==================================
// CARREGAMENTO DE DADOS DO GOOGLE SHEETS
// ==================================
async function carregarDadosGoogleSheets(nomeAba) {
    let planilhaId = GOOGLE_SHEETS_ID;
    if (arguments.length > 1 && arguments[1]) {
        planilhaId = arguments[1];
    }
    const url = `https://docs.google.com/spreadsheets/d/${planilhaId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(nomeAba)}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao carregar planilha: ${nomeAba}`);
        const text = await response.text();
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        const rows = data.table.rows;
        // Se for aba de lançamentos, processa diferente
        if (nomeAba.toLowerCase() === 'lancamentos') {
            const lancamentos = [];
            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].c;
                if (cells && cells[0] && cells[0].v && cells[1] && cells[1].v) {
                    lancamentos.push({
                        tipo: (cells[0]?.v || '').toLowerCase(),
                        url: cells[1]?.v || '',
                        ordem: Number(cells[3]?.v) || i+1
                    });
                }
            }
            lancamentos.sort((a, b) => a.ordem - b.ordem);
            console.log(`✅ ${lancamentos.length} lançamentos carregados do Google Sheets (${nomeAba})`);
            return lancamentos;
        }
        // Catálogo padrão
        const produtos = [];
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].c;
            if (cells && cells[0] && cells[0].v) {
                let produto;
                let precoValor = 0;
                if (nomeAba === 'tampas') {
                    // Coluna C (índice 2)
                    if (cells[2] && cells[2].v) {
                        let precoStr = String(cells[2].v).replace(/R\$/gi, '').replace(/\s/g, '').replace(',', '.');
                        precoValor = (!isNaN(parseFloat(precoStr)) && isFinite(precoStr) && precoStr !== '') ? parseFloat(precoStr) : 0;
                    }
                    produto = {
                        codigo: cells[0]?.v || '',
                        descricao: cells[1]?.v || '',
                        preco: precoValor,
                        imagem: ''
                    };
                } else if (nomeAba === 'cubos') {
                    // Coluna C (índice 2)
                    if (cells[2] && cells[2].v) {
                        let precoStr = String(cells[2].v).replace(/R\$/gi, '').replace(/\s/g, '').replace(',', '.');
                        precoValor = (!isNaN(parseFloat(precoStr)) && isFinite(precoStr) && precoStr !== '') ? parseFloat(precoStr) : 0;
                    }
                    produto = {
                        codigo: cells[0]?.v || '',
                        descricao: cells[1]?.v || '',
                        preco: precoValor,
                        imagem: cells[3]?.v || ''
                    };
                    if (cells[4] && cells[4].v) {
                        produto.cores = parsearCores(cells[4].v);
                    }
                } else if (nomeAba === 'variados') {
                    // Coluna D (índice 3)
                    if (cells[3] && cells[3].v) {
                        let precoStr = String(cells[3].v).replace(/R\$/gi, '').replace(/\s/g, '').replace(',', '.');
                        precoValor = (!isNaN(parseFloat(precoStr)) && isFinite(precoStr) && precoStr !== '') ? parseFloat(precoStr) : 0;
                    }
                    produto = {
                        codigo: cells[0]?.v || '',
                        categoria: cells[1]?.v || '',
                        descricao: cells[2]?.v || '',
                        preco: precoValor,
                        imagem: ''
                    };
                    if (cells[4] && cells[4].v) {
                        produto.cores = parsearCores(cells[4].v);
                    }
                } else {
                    // Padrão antigo
                    if (cells[2] && cells[2].v) {
                        let precoStr = String(cells[2].v).replace(/R\$/gi, '').replace(/\s/g, '').replace(',', '.');
                        precoValor = (!isNaN(parseFloat(precoStr)) && isFinite(precoStr) && precoStr !== '') ? parseFloat(precoStr) : 0;
                    }
                    produto = {
                        codigo: cells[0]?.v || '',
                        descricao: cells[1]?.v || '',
                        preco: precoValor,
                        imagem: cells[3]?.v || ''
                    };
                    if (cells[4] && cells[4].v) {
                        produto.cores = parsearCores(cells[4].v);
                    }
                }
                produtos.push(produto);
            }
        }
        console.log(`✅ ${produtos.length} produtos carregados do Google Sheets (${nomeAba})`);
        return produtos;
    } catch (error) {
        console.error(`Erro ao carregar Google Sheets (${nomeAba}):`, error);
        throw error;
    }
}

// ==================================
// CARREGAMENTO DINÂMICO DE CATÁLOGO (GOOGLE SHEETS OU JSON)
// ==================================
async function carregarCatalogoJSON(arquivoJSON, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} não encontrado`);
        return;
    }

    try {
        let produtos;
        
        // Verifica se deve usar Google Sheets
        if (USAR_GOOGLE_SHEETS && GOOGLE_SHEETS_ID !== 'COLE_SEU_ID_AQUI') {
            const nomeAba = SHEETS_ABAS[arquivoJSON];
            if (nomeAba) {
                produtos = await carregarDadosGoogleSheets(nomeAba);
            } else {
                throw new Error(`Aba não mapeada para: ${arquivoJSON}`);
            }
        } else {
            // Fallback: carrega do arquivo JSON local
            const response = await fetch(arquivoJSON);
            if (!response.ok) throw new Error(`Erro ao carregar ${arquivoJSON}`);
            produtos = await response.json();
            console.log(`✅ ${produtos.length} produtos carregados de ${arquivoJSON} (JSON local)`);
        }

        container.innerHTML = '';

        // Se for cubos, tampas ou outros, cria cards especiais
        if (arquivoJSON === 'catalogo-cubos.json' || arquivoJSON === 'catalogo-tampas.json' || arquivoJSON === 'catalogo-outros.json') {
            let grupos = {};
            let unicoCard = false;
            let cardTitulo = '';
            if (arquivoJSON === 'catalogo-outros.json') {
                // Agrupa por categoria (coluna B)
                produtos.forEach(produto => {
                    const categoria = produto.categoria || produto["categoria"] || produto["tipo"] || produto["Categoria"] || produto["Tipo"] || produto.tipo || 'Outros';
                    if (!grupos[categoria]) grupos[categoria] = [];
                    grupos[categoria].push(produto);
                });
            } else if (arquivoJSON === 'catalogo-tampas.json') {
                // Um único card para todas as tampas
                grupos = { 'Tampas': produtos };
                unicoCard = true;
                cardTitulo = 'Tampas';
            } else {
                grupos = { 'Cubos': produtos };
                unicoCard = true;
                cardTitulo = 'Cubos';
            }

            // Adiciona gap entre os cards de categoria
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '32px'; // Espaço entre categorias

            Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b)).forEach(([categoria, lista]) => {
                const card = document.createElement('div');
                card.classList.add('cubo-card');
                card.style.margin = '0'; // Remove margem individual, usa gap do container
                card.innerHTML = `
                    <div class="cubo-header" style="background:#d84040;display:flex;align-items:center;gap:12px;padding:18px 20px 10px 20px;border-top-left-radius:18px;border-top-right-radius:18px;">
                        <span style="font-size:2.2rem;display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:#fff;border-radius:10px;font-weight:bold;color:#d84040;">📦</span>
                        <h3 style="color:#fff;font-size:1.3rem;letter-spacing:1px;font-weight:700;margin:0;">${unicoCard ? cardTitulo : categoria}</h3>
                    </div>
                    <div class="cubo-specs" style="background:#18191b;padding:18px 20px 18px 20px;border-bottom-left-radius:18px;border-bottom-right-radius:18px;"></div>
                `;
                const specs = card.querySelector('.cubo-specs');
                lista.forEach(produto => {
                    const row = document.createElement('div');
                    row.classList.add('spec-row');
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';
                    row.style.gap = '16px';
                    row.style.marginBottom = '8px';

                    const code = document.createElement('span');
                    code.className = 'spec-code';
                    code.innerHTML = `<strong style="font-size:1.25rem;">${produto.codigo}</strong>`;

                    const desc = document.createElement('span');
                    desc.className = 'spec-desc';
                    desc.innerHTML = `<strong>${produto.descricao}</strong>`;

                    // Preço
                    const preco = document.createElement('span');
                    preco.className = 'spec-preco';
                    preco.style.color = '#fff';
                    preco.style.background = '#222';
                    preco.style.fontWeight = 'bold';
                    preco.style.fontSize = '0.95rem';
                    preco.style.padding = '4px 12px';
                    preco.style.borderRadius = '6px';
                    preco.style.marginLeft = '8px';
                    preco.textContent = 'R$ ' + (parseFloat(produto.preco).toFixed(2));

                    const btn = document.createElement('button');
                    btn.className = 'spec-cart-btn';
                    btn.innerHTML = '🛒';
                    btn.onclick = function() {
                        adicionarCuboAoCarrinho(produto.codigo, produto.descricao, produto.preco);
                    };

                    row.appendChild(code);
                    row.appendChild(desc);
                    row.appendChild(preco);
                    row.appendChild(btn);
                    specs.appendChild(row);
                });
                container.appendChild(card);
            });
        } else {
            // Padrão antigo para outras categorias
            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.classList.add('item-card');

                // Verificar se o produto tem variações de cores
                const temCores = produto.cores && produto.cores.length > 0;
                const coresAttr = temCores ? `data-cores='${JSON.stringify(produto.cores)}'` : '';

                // Garante que o preço é um número válido (mesmo se vier string vazia ou null)
                let precoNum = 0;
                if (produto.preco !== undefined && produto.preco !== null && produto.preco !== '') {
                    precoNum = Number(String(produto.preco).replace(/[^\d.,-]/g, '').replace(',', '.'));
                    if (isNaN(precoNum) || !isFinite(precoNum)) precoNum = 0;
                }

                card.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.descricao}">
                    <div class="titulo">${produto.descricao}</div>
                    <div class="preco" data-preco="${precoNum}">R$ ${precoNum.toFixed(2)}</div>
                    <div class="codigo">${produto.codigo}</div>
                    <div class="card-bottom-actions">
                        <input type="number" min="1" value="1" class="item-qtd">
                        <button class="btn-add-carrinho"
                            data-descricao="${produto.descricao}"
                            data-codigo="${produto.codigo}"
                            data-preco="${precoNum}"
                            ${coresAttr}>
                            Adicionar
                        </button>
                    </div>
                `;

                container.appendChild(card);
            });
        }

    } catch (error) {
        console.error(`Erro ao carregar catálogo:`, error);
        container.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

// ==================================
// DETECTA QUAL PÁGINA E CARREGA O JSON CORRESPONDENTE
// ==================================
function inicializarCatalogo() {
    const pathname = window.location.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    // Mapeamento: página → arquivo JSON
    const catalogoMap = {
        'psdpass.html': 'catalogo-pesado.json',
        'categoria-passeio.html': 'catalogo-passeio.json',
        'categoria-cubos.html': 'catalogo-cubos.json'
    };

    const arquivoJSON = catalogoMap[filename];

    // Categoria Passeio: carregar padrão e coloridos
    if (filename === 'categoria-passeio.html') {
        const padraoId = 'catalogo-padrao';
        const coloridosId = 'catalogo-coloridos';
        carregarCatalogoJSON('catalogo-passeio.json', padraoId); // carrega apenas o padrão inicialmente

        let coloridosCarregado = false;

        // Submenu toggling com lazy load
        const links = document.querySelectorAll('.catalog-submenu .subcat-link');
        const padrao = document.getElementById(padraoId);
        const coloridos = document.getElementById(coloridosId);

        links.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const target = link.getAttribute('href');

                if (target === '#catalogo-coloridos') {
                    // Esconde padrão e mostra coloridos
                    padrao.style.display = 'none';
                    coloridos.style.display = 'grid';
                    coloridos.hidden = false;
                    
                    // Carrega JSON apenas na primeira vez
                    if (!coloridosCarregado) {
                        await carregarCatalogoJSON('passeio-coloridos.json', coloridosId);
                        coloridosCarregado = true;
                    }
                } else {
                    // Esconde coloridos e mostra padrão
                    coloridos.style.display = 'none';
                    padrao.style.display = 'grid';
                    padrao.hidden = false;
                }
            });
        });
        return;
    }

    // Página de cubos: carregar catálogo de cubos no container correto
    if (filename === 'categoria-cubos.html' && document.getElementById('catalogo-cubos')) {
        carregarCatalogoJSON('catalogo-cubos.json', 'catalogo-cubos');
        return;
    }
    // Página de tampas: carregar catálogo de tampas no container correto
    if (filename === 'tampas.html' && document.getElementById('catalogo-tampas')) {
        carregarCatalogoJSON('catalogo-tampas.json', 'catalogo-tampas');
        return;
    }
    // Página de outros: carregar catálogo de outros no container correto
    if (filename === 'outros.html' && document.getElementById('catalogo-outros')) {
        carregarCatalogoJSON('catalogo-outros.json', 'catalogo-outros');
        return;
    }
    // Demais páginas: comportamento padrão único
    const catalogoContainer = document.querySelector('.catalogo');
    if (arquivoJSON && catalogoContainer) {
        console.log(`📂 Carregando catálogo: ${arquivoJSON}`);
        carregarCatalogoJSON(arquivoJSON, catalogoContainer.id || 'catalogo-container');
    }
}

// ==================================
// INICIALIZAÇÃO
// ==================================
document.addEventListener("DOMContentLoaded", () => {
            // Botão para exportar o carrinho como CSV
            const btnExportarCsv = document.getElementById('btn-exportar-csv');
            if (btnExportarCsv) {
                btnExportarCsv.addEventListener('click', () => {
                    const carrinho = safeGetCarrinho();
                    if (!carrinho.length) {
                        alert('Carrinho vazio!');
                        return;
                    }
                    // Dados do cliente
                    const clienteNome = (document.getElementById('clienteNome')?.value || '').trim();
                    const clienteCNPJ = (document.getElementById('clienteCNPJ')?.value || '').trim();
                    const clienteEmail = (document.getElementById('clienteEmail')?.value || '').trim();
                    const clienteTelefone = (document.getElementById('clienteTelefone')?.value || '').trim();

                    // Títulos
                    const tituloCliente = 'DADOS DO CLIENTE';
                    const tituloProdutos = 'ITENS DO CARRINHO';

                    // Cabeçalhos CSV em caixa alta
                    const header = ['CÓDIGO', 'DESCRIÇÃO', 'QUANTIDADE', 'PREÇO'];
                    // Corrige acentuação para UTF-8
                    const rows = carrinho.map(item => [
                        '"' + (item.codigo || '').replace(/"/g, '""') + '"',
                        '"' + (item.descricao || '').replace(/"/g, '""') + '"',
                        item.qtd || 1,
                        (Number(item.preco) || 0).toFixed(2).replace('.', ',')
                    ]);

                    let csv = '\uFEFF'; // BOM para Excel
                    csv += tituloCliente + '\n';
                    csv += 'Nome;' + '"' + clienteNome.replace(/"/g, '""') + '"' + '\n';
                    csv += 'CNPJ;' + '"' + clienteCNPJ.replace(/"/g, '""') + '"' + '\n';
                    csv += 'E-mail;' + '"' + clienteEmail.replace(/"/g, '""') + '"' + '\n';
                    csv += 'Telefone;' + '"' + clienteTelefone.replace(/"/g, '""') + '"' + '\n';
                    csv += 'Observação;' + '"' + (document.getElementById('clienteObs')?.value || '').replace(/"/g, '""') + '"' + '\n';
                    csv += '\n\n\n'; // Três linhas em branco
                    csv += tituloProdutos + '\n';
                    csv += header.join(';') + '\n';
                    csv += rows.map(r => r.join(';')).join('\n');
                    // Cria e baixa o arquivo
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    // Gera nome do arquivo com data atual DD-MM-AA
                    const hoje = new Date();
                    const dia = String(hoje.getDate()).padStart(2, '0');
                    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
                    const ano = String(hoje.getFullYear()).slice(-2);
                    const nomeArquivo = `Orçamento-${dia}-${mes}-${ano}.csv`;
                    link.download = nomeArquivo;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }
        // Se acessar a página já com #catalogo-coloridos, abrir direto a aba Variados
        if (window.location.pathname.includes('categoria-passeio.html') && window.location.hash === '#catalogo-coloridos') {
            setTimeout(() => {
                const variadoSidebar = document.querySelector('.category-list .category-btn[href="#catalogo-coloridos"]');
                if (variadoSidebar) {
                    variadoSidebar.click();
                }
            }, 10);
        }
    setupIntroVideo();
    setupPdfButton();
    inicializarCatalogo(); // Carrega o catálogo via JSON

    // Corrige o clique do menu lateral "Variados" na categoria passeio
    if (window.location.pathname.includes('categoria-passeio.html')) {
        const variadoSidebar = document.querySelector('.category-list .category-btn[href="#catalogo-coloridos"]');
        const passeioSidebar = document.querySelector('.category-list .category-btn[href="categoria-passeio.html"]');
        if (variadoSidebar) {
            variadoSidebar.addEventListener('click', function(e) {
                e.preventDefault();
                // Garante que sempre mostra a aba Variados na primeira tentativa
                const padrao = document.getElementById('catalogo-padrao');
                const coloridos = document.getElementById('catalogo-coloridos');
                if (padrao && coloridos) {
                    padrao.style.display = 'none';
                    padrao.hidden = true;
                    coloridos.style.display = 'grid';
                    coloridos.hidden = false;
                    if (!coloridos.dataset.carregado) {
                        carregarCatalogoJSON('passeio-coloridos.json', 'catalogo-coloridos').then(() => {
                            coloridos.dataset.carregado = 'true';
                        });
                    }
                }
                document.querySelectorAll('.category-list .category-btn').forEach(btn => btn.classList.remove('active'));
                variadoSidebar.classList.add('active');
            });
        }
        // Passeio sempre mostra o catálogo padrão e deixa "Passeio" ativo
        if (passeioSidebar) {
            passeioSidebar.addEventListener('click', function(e) {
                // Só manipula se já estiver na página
                if (window.location.pathname.endsWith('categoria-passeio.html')) {
                    e.preventDefault();
                    const padrao = document.getElementById('catalogo-padrao');
                    const coloridos = document.getElementById('catalogo-coloridos');
                    if (padrao && coloridos) {
                        padrao.style.display = 'grid';
                        padrao.hidden = false;
                        coloridos.style.display = 'none';
                        coloridos.hidden = true;
                    }
                    document.querySelectorAll('.category-list .category-btn').forEach(btn => btn.classList.remove('active'));
                    passeioSidebar.classList.add('active');
                }
            });
        }
    }

    if (document.getElementById("listaCarrinho") || document.getElementById("carrinho-itens")) {
        console.log("🔍 Página do carrinho detectada");
        console.log("📦 Carrinho no localStorage:", localStorage.getItem("carrinho"));
        console.log("📋 Carrinho parseado:", safeGetCarrinho());
        renderCarrinhoPage();
    }

    // Setup formulário de contato WhatsApp (index.html)
    setupFormContatoWhatsApp();

    // Setup botão enviar orçamento WhatsApp (carrinho.html)
    setupBotaoOrcamentoWhatsApp();
});

// ==================================
// WHATSAPP - FORMULÁRIO DE CONTATO (INDEX)
// ==================================
function setupFormContatoWhatsApp() {
    const form = document.getElementById('formContato');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const cidade = document.getElementById('cidade')?.value || '';
        
        const mensagem = `Olá! Meu nome é ${nome}.%0A` +
                        `E-mail: ${email}%0A` +
                        `Cidade: ${cidade}%0A%0A` +
                        `Gostaria de mais informações sobre os produtos.`;
        
        const telefone = '5512997271120';
        const url = `https://wa.me/${telefone}?text=${mensagem}`;
        
        window.open(url, '_blank');
    });
}

// ==================================
// WHATSAPP - ORÇAMENTO DO CARRINHO
// ==================================
function setupBotaoOrcamentoWhatsApp() {
    const btn = document.getElementById('btnEnviarOrcamento');
    if (!btn) return;
    
    btn.addEventListener('click', function() {
        const carrinho = safeGetCarrinho();
        
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        // Pega nome do cliente se existir
        const nomeCliente = document.getElementById('nomeCliente')?.value || 'Cliente';
        
        // Monta lista de itens
        let listaItens = carrinho.map(item => {
            const preco = item.preco > 0 ? ` - R$ ${Number(item.preco).toFixed(2)}` : ' - Sob consulta';
            return `• ${item.qtd}x ${item.codigo} - ${item.descricao}${preco}`;
        }).join('%0A');
        
        // Calcula total
        const total = carrinho.reduce((acc, item) => acc + (Number(item.preco) || 0) * (Number(item.qtd) || 1), 0);
        const totalTexto = total > 0 ? `R$ ${total.toFixed(2)}` : 'Sob consulta';
        
        const mensagem = `*Orçamento RD Volantes*%0A%0A` +
                        `*Cliente:* ${nomeCliente}%0A%0A` +
                        `*Itens do Pedido:*%0A${listaItens}%0A%0A` +
                        `*Total:* ${totalTexto}%0A%0A` +
                        `Aguardo retorno!`;
        
        const telefone = '5512997271120';
        const url = `https://wa.me/${telefone}?text=${mensagem}`;
        
        window.open(url, '_blank');
    });
}
