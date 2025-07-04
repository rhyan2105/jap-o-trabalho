document.addEventListener('DOMContentLoaded', function() {
    // Suavizar rolagem para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Botão de citação
    const quoteBtn = document.getElementById('quote-btn');
    const quoteDisplay = document.getElementById('quote-display');
    
    const samuraiQuotes = [
        "O caminho do samurai é encontrado na morte.",
        "A vida é como andar sobre a neve, cada passo fica registrado.",
        "Conhecer o seu próprio caminho é conhecer a si mesmo.",
        "A coragem é fazer o que é certo, mesmo quando é difícil.",
        "A espada é a alma do samurai.",
        "A verdadeira vitória é a vitória sobre si mesmo.",
        "O fracasso não existe quando você dá o seu melhor.",
        "A paciência é a base da segurança e longevidade.",
        "A mente inabalável é a maior arma do guerreiro.",
        "O samurai deve primeiro se preocupar em manter sua honra."
    ];
    
    quoteBtn.addEventListener('click', function() {
        const randomQuote = samuraiQuotes[Math.floor(Math.random() * samuraiQuotes.length)];
        
        quoteDisplay.textContent = `"${randomQuote}"`;
        quoteDisplay.style.display = 'block';
    });
    
    // Efeito de destaque ao rolar
    const sections = document.querySelectorAll('section');
    
    function highlightOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                document.querySelector(`nav a[href="#${id}"]`).style.backgroundColor = '#8B0000';
            } else {
                const id = section.getAttribute('id');
                document.querySelector(`nav a[href="#${id}"]`).style.backgroundColor = 'transparent';
            }
        });
    }
    
    window.addEventListener('scroll', highlightOnScroll);
    highlightOnScroll(); // Chamar uma vez ao carregar para destacar a seção inicial
});