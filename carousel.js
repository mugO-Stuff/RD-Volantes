// Carrossel de imagens dinâmico
// Este script lê o CSV público da aba "carrosel" do Google Sheets e gera o carrossel horizontal automaticamente

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ30n0Jj7-Bbv0Qv1gobbMDz6YOWfwQ7LuceRdxkGVKJAlgmFXnpbp5j-TCrLgkTkUxSc8Jf-f5m6Dd/pub?gid=1312973725&single=true&output=csv';

async function carregarImagensCarrossel() {
    const response = await fetch(SHEETS_CSV_URL);
    const csv = await response.text();
    const linhas = csv.split('\n'); // Sem cabeçalho
    const container = document.getElementById('carousel-container');
    container.innerHTML = '';
    const items = [];
    linhas.forEach(linha => {
        if (linha.trim() === '') return;
        const [caminho, descricao] = linha.split(',');
        if (!caminho || !descricao) return;
        const imgDiv = document.createElement('div');
        imgDiv.className = 'carousel-item';
        imgDiv.innerHTML = `<img src="${caminho}" alt="Imagem do Carrossel">`;
        container.appendChild(imgDiv);
        items.push(imgDiv);
    });
    // Slider: mostrar uma imagem por vez
    let idx = 0;
    function showSlide(i) {
        items.forEach((item, j) => {
            item.classList.toggle('active', j === i);
        });
    }
    showSlide(idx);
    setInterval(() => {
        idx = (idx + 1) % items.length;
        showSlide(idx);
    }, 3000);
}
carregarImagensCarrossel();
