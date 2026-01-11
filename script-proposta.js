// script-proposta.js - PARA PROPOSTA (proposta.html)

// VARIÁVEIS GLOBAIS PARA CARROSSÉIS
let currentSlideHotel = 0;
let slidesHotel = [];
let currentSlidesDestino = {};

// FUNÇÃO PARA FORMATAR TEXTO DE PASSEIOS
function montarListaFromText(text) {
    if (!text) return "";

    const linhas = text.split("<br>").map(s => s.trim()).filter(s => s);
    if (linhas.length === 0) return "";

    const icones = ["🗺️", "📍", "🌟", "🏛️", "🍝", "🚶", "🎒", "📸", "⭐", "✨", "🌄", "🏞️", "🎭", "🍴", "🚤", "🚁", "🏖️", "🎪", "🛍️", "🌇"];

    return linhas.map((l, i) => {
        const texto = l.replace(/^•\s*/, "");
        return `<div class="item"><span class="icone-passeio">${icones[i % icones.length]}</span><span>${texto}</span></div>`;
    }).join("");
}

// FUNÇÃO PARA FORMATAR DICAS
function formatarDicas(texto) {
    if (!texto) return "<p>Nenhuma dica fornecida.</p>";

    const linhas = texto.split("<br>").map(s => s.trim()).filter(s => s);
    return linhas.map(l => `<p>${l}</p>`).join("");
}

// FUNÇÃO PARA DECODIFICAR DADOS DA URL
function obterDadosDaURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // NOVO: buscar por ID curto
    const id = urlParams.get('id');
    if (id) {
        try {
            const dados = localStorage.getItem(`proposta_${id}`);
            if (dados) {
                console.log("Dados carregados via ID curto");
                return JSON.parse(dados);
            }
        } catch (e) {
            console.error("Erro ao carregar dados pelo ID:", e);
        }
    }

    // LEGADO: manter compatibilidade com ?data=
    const dadosCodificados = urlParams.get('data');
    if (dadosCodificados) {
        try {
            const dadosJSON = decodeURIComponent(atob(dadosCodificados));
            console.log("Dados carregados via URL longa (legado)");
            return JSON.parse(dadosJSON);
        } catch (e) {
            console.error("Erro ao decodificar dados da URL:", e);
        }
    }

    return null;
}

// FUNÇÃO PARA CARREGAR DADOS (da URL ou localStorage)
function carregarDados() {
    const dadosURL = obterDadosDaURL();

    if (dadosURL) {
        console.log("Dados carregados da URL");
        return dadosURL;
    } else {
        console.log("Carregando dados do localStorage");
        const dados = {};

        // Carregar campos básicos
        const campos = [
            "destino", "mesAno", "chegada", "traslado",
            "foto01", "foto02", "foto03",
            "hotelServicosCampo",
            "dicasCampo", "valorHotel", "valorAereo", "valorTraslado", "valorSeguro",
            "tituloHospedagemCampo", "hotelCheckinCampo", "hotelCheckoutCampo",
            "descricaoCampo", "enderecoCampo"
        ];

        campos.forEach(id => {
            dados[id] = localStorage.getItem(id) || "";
        });

        // Carregar destinos
        try {
            const destinosJSON = localStorage.getItem('destinosMultiplos');
            dados.destinosMultiplos = destinosJSON || "[]";
        } catch (e) {
            dados.destinosMultiplos = "[]";
        }

        // Carregar imagens do hotel
        try {
            const hotelImagens = localStorage.getItem('carrosselImagensHotel');
            dados.carrosselImagensHotel = hotelImagens || "[]";
        } catch (e) {
            dados.carrosselImagensHotel = "[]";
        }

        // Carregar imagens dos destinos
        try {
            const destinosImagens = localStorage.getItem('carrosselImagensDestinos');
            dados.carrosselImagensDestinos = destinosImagens || "{}";
        } catch (e) {
            dados.carrosselImagensDestinos = "{}";
        }

        return dados;
    }
}

// FUNÇÃO PARA PROCESSAR DADOS
function processarDados(dados) {
    console.log("Processando dados...", dados);

    // Campos que devem receber HTML
    const camposHTML = ["hotelServicosCampo"];

    // Campos de texto simples
    const camposTexto = [
        "destino", "mesAno", "chegada", "traslado",
        "tituloHospedagemCampo", "hotelCheckinCampo", "hotelCheckoutCampo",
        "descricaoCampo", "enderecoCampo", "dicasCampo"
    ];

    // Preencher campos HTML
    camposHTML.forEach(id => {
        const el = document.getElementById(id);
        if (el && dados[id]) el.innerHTML = dados[id];
    });

    // Preencher campos texto
    camposTexto.forEach(id => {
        const el = document.getElementById(id) || document.getElementById(id + "Campo");
        if (el && dados[id]) {
            if (id === "dicasCampo") {
                el.innerHTML = formatarDicas(dados[id]);
            } else if (id === "destino") {
                const destinoEl = document.getElementById("destinoCampo");
                if (destinoEl) destinoEl.textContent = dados[id];
            } else if (id === "mesAno") {
                const mesAnoEl = document.getElementById("mesAnoCampo");
                if (mesAnoEl) mesAnoEl.textContent = dados[id];
            } else {
                el.textContent = dados[id];
            }
        }
    });

    // Preencher imagens fixas
    const imagensFixas = ["foto01", "foto02", "foto03"];
    imagensFixas.forEach(id => {
        const imgEl = document.getElementById("img" + id.charAt(0).toUpperCase() + id.slice(1));
        if (imgEl && dados[id]) {
            imgEl.src = dados[id];
            imgEl.onerror = function () {
                this.style.display = 'none';
            };
        }
    });
}

// FUNÇÃO PARA INICIALIZAR CARROSSEL DO HOTEL
function initCarrosselHotel(dados) {
    const container = document.getElementById('carrossel-images-hotel');
    const dotsContainer = document.getElementById('carrossel-dots-hotel');
    const counter = document.getElementById('carrossel-counter-hotel');

    if (!container) return;

    // Limpar container
    container.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';
    if (counter) counter.innerHTML = '';

    // Carregar imagens dos dados
    let carrosselImagesHotel = [];
    try {
        if (dados.carrosselImagensHotel) {
            if (typeof dados.carrosselImagensHotel === 'string') {
                carrosselImagesHotel = JSON.parse(dados.carrosselImagensHotel);
            } else {
                carrosselImagesHotel = dados.carrosselImagensHotel;
            }
        }
    } catch (e) {
        console.error("Erro ao carregar imagens do hotel:", e);
        carrosselImagesHotel = [];
    }

    // Filtrar apenas imagens válidas
    carrosselImagesHotel = carrosselImagesHotel.filter(src => src && src.trim() !== '');

    // Se não houver imagens, mostrar mensagem
    if (carrosselImagesHotel.length === 0) {
        container.innerHTML = '<div class="carrossel-message">Nenhuma imagem disponível</div>';
        return;
    }

    // Adicionar imagens ao carrossel
    carrosselImagesHotel.forEach((src, index) => {
        const img = document.createElement('img');
        img.className = 'carrossel-image';
        img.src = src;
        img.alt = `Imagem ${index + 1} do hotel`;
        img.onerror = function() {
            this.style.display = 'none';
        };
        
        container.appendChild(img);

        // Adicionar ponto de navegação
        if (dotsContainer) {
            const dot = document.createElement('div');
            dot.className = 'carrossel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSlideHotel(index));
            dotsContainer.appendChild(dot);
        }
    });

    // Atualizar contador
    if (counter) {
        counter.textContent = `1 / ${carrosselImagesHotel.length}`;
    }

    // Mostrar primeiro slide
    showSlideHotel(0);
}

// FUNÇÃO PARA MOSTRAR SLIDE DO HOTEL
function showSlideHotel(index) {
    const container = document.getElementById('carrossel-images-hotel');
    if (!container) return;

    const slides = container.querySelectorAll('.carrossel-image');
    const dots = document.querySelectorAll('#carrossel-dots-hotel .carrossel-dot');
    const counter = document.getElementById('carrossel-counter-hotel');

    if (slides.length === 0) return;

    // Esconder todos os slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Remover active de todos os dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Mostrar slide atual
    if (slides[index]) {
        slides[index].classList.add('active');
    }

    // Ativar dot atual
    if (dots[index]) {
        dots[index].classList.add('active');
    }

    // Atualizar contador
    if (counter) {
        counter.textContent = `${index + 1} / ${slides.length}`;
    }

    currentSlideHotel = index;
}

// FUNÇÃO PARA PRÓXIMO SLIDE DO HOTEL
function nextSlideHotel() {
    const container = document.getElementById('carrossel-images-hotel');
    if (!container) return;

    const slides = container.querySelectorAll('.carrossel-image');
    if (slides.length === 0) return;

    const nextIndex = (currentSlideHotel + 1) % slides.length;
    showSlideHotel(nextIndex);
}

// FUNÇÃO PARA SLIDE ANTERIOR DO HOTEL
function prevSlideHotel() {
    const container = document.getElementById('carrossel-images-hotel');
    if (!container) return;

    const slides = container.querySelectorAll('.carrossel-image');
    if (slides.length === 0) return;

    const prevIndex = (currentSlideHotel - 1 + slides.length) % slides.length;
    showSlideHotel(prevIndex);
}

// FUNÇÃO PARA INICIALIZAR DESTINOS DINÂMICOS
function initDestinos(dados) {
    const container = document.getElementById('destinos-container');
    if (!container) return;

    container.innerHTML = '';

    // Carregar destinos
    let destinos = [];
    try {
        if (dados.destinosMultiplos) {
            if (typeof dados.destinosMultiplos === 'string') {
                destinos = JSON.parse(dados.destinosMultiplos);
            } else {
                destinos = dados.destinosMultiplos;
            }
        }
    } catch (e) {
        console.error("Erro ao carregar destinos:", e);
        destinos = [];
    }

    // Carregar imagens dos destinos
    let imagensPorDestino = {};
    try {
        if (dados.carrosselImagensDestinos) {
            if (typeof dados.carrosselImagensDestinos === 'string') {
                imagensPorDestino = JSON.parse(dados.carrosselImagensDestinos);
            } else {
                imagensPorDestino = dados.carrosselImagensDestinos;
            }
        }
    } catch (e) {
        console.error("Erro ao carregar imagens dos destinos:", e);
        imagensPorDestino = {};
    }

    // Criar página para cada destino
    destinos.forEach((destino, index) => {
        if (!destino.nome && !destino.passeios && !destino.dicas) return;

        const destinoIndex = destino.index || (index + 1);
        const imagensDestino = imagensPorDestino[destinoIndex] || [];
        
        const paginaDestino = document.createElement('div');
        paginaDestino.className = 'page destino-pagina';
        paginaDestino.id = `page-destino-${destinoIndex}`;

        let conteudoHTML = `
            <img src="assets/logo.png" class="logo" alt="Logo">
            <h1 class="destino-nome-titulo">${destino.nome || `Destino ${destinoIndex}`}</h1>
            
            <div class="destino-container">
        `;

        // Adicionar passeios se existirem
        if (destino.passeios && destino.passeios.trim() !== '') {
            conteudoHTML += `
                <h2>Passeios e Atividades</h2>
                <div class="lista-passeios">${montarListaFromText(destino.passeios)}</div>
            `;
        }

        // Adicionar dicas se existirem
        if (destino.dicas && destino.dicas.trim() !== '') {
            conteudoHTML += `
                <h2>Dicas Locais</h2>
                <div class="dicas-locais">${formatarDicas(destino.dicas)}</div>
            `;
        }

        // Adicionar carrossel de imagens se existirem
        if (imagensDestino.length > 0) {
            const imagensValidas = imagensDestino.filter(src => src && src.trim() !== '');
            
            if (imagensValidas.length > 0) {
                conteudoHTML += `
                    <div class="destino-carrossel" id="carrossel-destino-${destinoIndex}">
                        <h2>Imagens do Destino</h2>
                        <div class="carrossel-images" id="carrossel-images-destino-${destinoIndex}">
                `;
                
                imagensValidas.forEach((src, imgIndex) => {
                    conteudoHTML += `
                        <img class="carrossel-image" src="${src}" alt="Imagem ${imgIndex + 1} do destino" 
                             onerror="this.style.display='none'">
                    `;
                });
                
                conteudoHTML += `
                        </div>
                        <div class="carrossel-controls">
                            <button class="carrossel-prev" onclick="prevSlideDestino(${destinoIndex})">❮</button>
                            <div class="carrossel-dots" id="carrossel-dots-destino-${destinoIndex}"></div>
                            <button class="carrossel-next" onclick="nextSlideDestino(${destinoIndex})">❯</button>
                        </div>
                        <div class="carrossel-counter" id="carrossel-counter-destino-${destinoIndex}"></div>
                    </div>
                `;
            }
        }

        conteudoHTML += `
            </div>
            <div class="rodape"><img src="assets/rodape.png" alt="Rodapé"></div>
        `;

        paginaDestino.innerHTML = conteudoHTML;
        container.appendChild(paginaDestino);
        
        // Inicializar carrossel deste destino se houver imagens
        if (imagensDestino.length > 0) {
            initCarrosselDestino(destinoIndex, imagensDestino);
        }
        
        // Mostrar a página do destino
        paginaDestino.style.display = 'block';
    });
}

// FUNÇÃO PARA INICIALIZAR CARROSSEL DE DESTINO
function initCarrosselDestino(destinoIndex, imagens) {
    const container = document.getElementById(`carrossel-images-destino-${destinoIndex}`);
    const dotsContainer = document.getElementById(`carrossel-dots-destino-${destinoIndex}`);
    const counter = document.getElementById(`carrossel-counter-destino-${destinoIndex}`);

    if (!container) return;

    // Filtrar apenas imagens válidas
    const imagensValidas = imagens.filter(src => src && src.trim() !== '');
    if (imagensValidas.length === 0) return;

    // Inicializar slide atual para este destino
    currentSlidesDestino[destinoIndex] = 0;

    // Criar pontos de navegação
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        imagensValidas.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carrossel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSlideDestino(destinoIndex, index));
            dotsContainer.appendChild(dot);
        });
    }

    // Atualizar contador
    if (counter) {
        counter.textContent = `1 / ${imagensValidas.length}`;
    }

    // Mostrar primeiro slide
    showSlideDestino(destinoIndex, 0);
}

// FUNÇÃO PARA MOSTRAR SLIDE DE DESTINO
function showSlideDestino(destinoIndex, slideIndex) {
    const container = document.getElementById(`carrossel-images-destino-${destinoIndex}`);
    if (!container) return;

    const slides = container.querySelectorAll('.carrossel-image');
    const dots = document.querySelectorAll(`#carrossel-dots-destino-${destinoIndex} .carrossel-dot`);
    const counter = document.getElementById(`carrossel-counter-destino-${destinoIndex}`);

    if (slides.length === 0) return;

    // Ajustar índice se necessário
    if (slideIndex < 0) slideIndex = slides.length - 1;
    if (slideIndex >= slides.length) slideIndex = 0;

    // Esconder todos os slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Remover active de todos os dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Mostrar slide atual
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
    }

    // Ativar dot atual
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }

    // Atualizar contador
    if (counter) {
        counter.textContent = `${slideIndex + 1} / ${slides.length}`;
    }

    currentSlidesDestino[destinoIndex] = slideIndex;
}

// FUNÇÃO PARA PRÓXIMO SLIDE DE DESTINO
function nextSlideDestino(destinoIndex) {
    const currentSlide = currentSlidesDestino[destinoIndex] || 0;
    showSlideDestino(destinoIndex, currentSlide + 1);
}

// FUNÇÃO PARA SLIDE ANTERIOR DE DESTINO
function prevSlideDestino(destinoIndex) {
    const currentSlide = currentSlidesDestino[destinoIndex] || 0;
    showSlideDestino(destinoIndex, currentSlide - 1);
}

// FUNÇÃO PARA CALCULAR VALORES
function calcularValores(dados) {
    const itemsList = document.getElementById('itemsList');
    if (!itemsList) return;

    // Converter valores para número
    const parseValor = (valor) => {
        if (!valor) return 0;
        const num = parseFloat(valor.toString().replace(/\./g, '').replace(',', '.'));
        return isNaN(num) ? 0 : num;
    };

    const valorHotel = parseValor(dados.valorHotel);
    const valorAereo = parseValor(dados.valorAereo);
    const valorTraslado = parseValor(dados.valorTraslado);
    const valorSeguro = parseValor(dados.valorSeguro);

    const total = valorHotel + valorAereo + valorTraslado + valorSeguro;

    // Formatar para moeda brasileira
    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });
    };

    // Criar HTML dos valores
    let html = `
        <div class="row">
            <div class="label">Hotel</div>
            <div class="dots"></div>
            <div class="price">${formatarMoeda(valorHotel)}</div>
        </div>
        <div class="row">
            <div class="label">Passagem Aérea</div>
            <div class="dots"></div>
            <div class="price">${formatarMoeda(valorAereo)}</div>
        </div>
        <div class="row">
            <div class="label">Traslado</div>
            <div class="dots"></div>
            <div class="price">${formatarMoeda(valorTraslado)}</div>
        </div>
        <div class="row">
            <div class="label">Seguro Viagem</div>
            <div class="dots"></div>
            <div class="price">${formatarMoeda(valorSeguro)}</div>
        </div>
        <div class="row total">
            <div class="label">Total</div>
            <div class="dots"></div>
            <div class="price">${formatarMoeda(total)}</div>
        </div>
    `;

    itemsList.innerHTML = html;
}

// FUNÇÃO PARA CONFIGURAR BACKGROUND DA PÁGINA 1
function configurarBackgroundPagina1() {
    const page1 = document.getElementById('page1');
    if (page1) {
        page1.style.backgroundImage = "url('./assets/bg/slide1.jpg')";
        page1.style.backgroundSize = "cover";
        page1.style.backgroundPosition = "center";
        page1.style.backgroundRepeat = "no-repeat";
    }
}

// INICIALIZAÇÃO DA PÁGINA DE PROPOSTA
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página de proposta carregada");

    // Carregar dados
    const dados = carregarDados();
    
    if (dados) {
        // Processar dados básicos
        processarDados(dados);
        
        // Configurar background da página 1
        configurarBackgroundPagina1();
        
        // Inicializar carrossel do hotel
        initCarrosselHotel(dados);
        
        // Inicializar destinos dinâmicos
        initDestinos(dados);
        
        // Calcular e exibir valores
        calcularValores(dados);
        
        // Configurar auto-slide para carrossel do hotel
        setInterval(() => {
            nextSlideHotel();
        }, 5000);
    } else {
        console.error("Nenhum dado encontrado para exibir a proposta");
        alert("Erro: Nenhum dado de proposta encontrado. Por favor, preencha o formulário primeiro.");
    }
});