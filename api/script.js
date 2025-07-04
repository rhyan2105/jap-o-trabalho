document.addEventListener('DOMContentLoaded', function() {
    // Elementos da DOM
    const wikiSearchBtn = document.getElementById('wiki-search-btn');
    const wikiSearchInput = document.getElementById('wiki-search');
    const wikiResults = document.getElementById('wiki-results');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const getImageBtn = document.getElementById('get-image-btn');
    const imageContainer = document.getElementById('image-container');

    // Citações de samurais (como fallback caso a API não funcione)
    const samuraiQuotes = [
        { text: "O caminho do samurai é encontrado na morte.", author: "Yamamoto Tsunetomo" },
        { text: "Conhecer o seu próprio caminho é conhecer a si mesmo.", author: "Miyamoto Musashi" },
        { text: "A verdadeira vitória é a vitória sobre si mesmo.", author: "Takuan Sōhō" },
        { text: "A espada é a alma do samurai.", author: "Provérbio Samurai" },
        { text: "A mente inabalável é a maior arma do guerreiro.", author: "Daidoji Yūzan" }
    ];

    // Buscar na Wikipedia
    wikiSearchBtn.addEventListener('click', searchWikipedia);
    wikiSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWikipedia();
        }
    });

    async function searchWikipedia() {
        const searchTerm = wikiSearchInput.value.trim() || 'samurai';
        
        wikiResults.innerHTML = '<div class="loader"></div>';
        
        try {
            // Usando a API da Wikipedia (MediaWiki)
            const response = await fetch(
                `https://pt.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(searchTerm)}`
            );
            
            const data = await response.json();
            
            // Processar os resultados
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];
            
            if (pageId === '-1' || !page.extract) {
                wikiResults.innerHTML = '<p>Nenhum resultado encontrado. Tente outro termo.</p>';
                return;
            }
            
            let html = `<h3>${page.title}</h3>`;
            html += `<p>${page.extract}</p>`;
            html += `<a href="https://pt.wikipedia.org/wiki/${encodeURIComponent(page.title)}" target="_blank">Ler mais na Wikipedia</a>`;
            
            wikiResults.innerHTML = html;
        } catch (error) {
            console.error('Erro ao buscar na Wikipedia:', error);
            wikiResults.innerHTML = '<p>Erro ao carregar dados. Tente novamente mais tarde.</p>';
        }
    }

    // Obter citação
    getQuoteBtn.addEventListener('click', getQuote);

    async function getQuote() {
        quoteText.textContent = "Carregando...";
        quoteAuthor.textContent = "";
        
        try {
            // Tentar usar API de citações (pode não estar disponível)
            const response = await fetch('https://api.quotable.io/random?tags=wisdom');
            const data = await response.json();
            
            // Se a citação for muito longa, usar uma das nossas
            if (data.content.length > 150) {
                throw new Error("Citação muito longa");
            }
            
            quoteText.textContent = `"${data.content}"`;
            quoteAuthor.textContent = `- ${data.author || "Autor desconhecido"}`;
        } catch (error) {
            console.log("Usando citação local:", error);
            // Fallback para citações locais
            const randomQuote = samuraiQuotes[Math.floor(Math.random() * samuraiQuotes.length)];
            quoteText.textContent = `"${randomQuote.text}"`;
            quoteAuthor.textContent = `- ${randomQuote.author}`;
        }
    }

    // Obter imagem de samurai
    getImageBtn.addEventListener('click', getSamuraiImage);

    async function getSamuraiImage() {
        imageContainer.innerHTML = '<div class="loader"></div>';
        
        try {
            // Usando a API do Wikimedia Commons (imagens da Wikipedia)
            const response = await fetch(
                'https://commons.wikimedia.org/w/api.php?action=query&generator=images&gimlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*&ginamespace=6&giuser=Samurai'
            );
            
            const data = await response.json();
            
            if (!data.query || !data.query.pages) {
                throw new Error("Nenhuma imagem encontrada");
            }
            
            const pageId = Object.keys(data.query.pages)[0];
            const imageInfo = data.query.pages[pageId].imageinfo[0];
            
            const img = document.createElement('img');
            img.src = imageInfo.thumburl;
            img.alt = "Imagem de samurai";
            
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
        } catch (error) {
            console.error("Erro ao carregar imagem:", error);
            
            // Fallback para imagens estáticas
            const fallbackImages = [
                'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/KuniyoshiUtagawa_TheGhostOfTairaNoTomomori.jpg/600px-KuniyoshiUtagawa_TheGhostOfTairaNoTomomori.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Samurai_with_sword.jpg/600px-Samurai_with_sword.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Samurai_resting.jpg/600px-Samurai_resting.jpg'
            ];
            
            const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
            
            const img = document.createElement('img');
            img.src = randomImage;
            img.alt = "Imagem de samurai";
            
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
        }
    }

    // Carregar conteúdo inicial
    searchWikipedia();
    getQuote();
});