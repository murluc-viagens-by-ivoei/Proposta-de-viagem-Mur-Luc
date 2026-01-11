// script.js - PARA FORMULÁRIO (index.html)

// VARIÁVEIS GLOBAIS PARA CONTROLE
let destinoCount = 0;
const MAX_DESTINOS = 20;

let carrosselHotelCount = 1;
const MAX_IMAGENS_HOTEL = 8;

const MAX_IMAGENS_DESTINO = 8;

// Flag para controlar se já carregamos os dados
let dadosCarregados = false;

// INICIALIZAÇÃO - CARREGAR DADOS SALVOS
document.addEventListener('DOMContentLoaded', function () {
    console.log("Formulário carregado");

    // Carregar dados do localStorage
    carregarDadosFormulario();

    const btnAdicionarImagemHotel = document.getElementById('adicionar-imagem-hotel-btn');
    const btnAdicionarDestino = document.getElementById('adicionar-destino-btn');

    if (btnAdicionarImagemHotel) {
        btnAdicionarImagemHotel.addEventListener('click', () => adicionarNovaImagem('hotel'));
        atualizarBotaoImagem('hotel');
    }

    if (btnAdicionarDestino) {
        btnAdicionarDestino.addEventListener('click', adicionarNovoDestino);
    }

    // Marcar que os dados foram carregados
    dadosCarregados = true;

    // Adicionar listener para salvar dados automaticamente
    adicionarListenersParaSalvamentoAutomatico();

    // Adicionar listener único para o submit do formulário
    const form = document.getElementById('formCotacao');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

// FUNÇÃO PARA CARREGAR DADOS DO FORMULÁRIO
function carregarDadosFormulario() {
    console.log("Carregando dados do formulário do localStorage...");

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
        const el = document.getElementById(id);
        if (el) {
            const valor = localStorage.getItem(id);
            if (valor !== null) {
                el.value = valor;
            }
        }
    });

    // Carregar destinos múltiplos
    try {
        const destinosJSON = localStorage.getItem('destinosMultiplos');
        if (destinosJSON) {
            const destinos = JSON.parse(destinosJSON);
            destinos.forEach(destino => {
                destinoCount++;
                adicionarDestinoUI(destino, destinoCount);
            });
        }
    } catch (e) {
        console.error("Erro ao carregar destinos:", e);
    }

    // Carregar imagens do hotel
    try {
        const hotelImagens = localStorage.getItem('carrosselImagensHotel');
        if (hotelImagens) {
            const imagens = JSON.parse(hotelImagens);
            carregarImagensCarrossel(imagens, 'hotel');
        }
    } catch (e) {
        console.error("Erro ao carregar imagens do hotel:", e);
    }

    // Carregar imagens dos destinos
    try {
        const destinosImagens = localStorage.getItem('carrosselImagensDestinos');
        if (destinosImagens) {
            const imagensPorDestino = JSON.parse(destinosImagens);
            Object.keys(imagensPorDestino).forEach(destinoIndex => {
                const imagens = imagensPorDestino[destinoIndex];
                if (imagens && imagens.length > 0) {
                    carregarImagensCarrosselDestino(destinoIndex, imagens);
                }
            });
        }
    } catch (e) {
        console.error("Erro ao carregar imagens dos destinos:", e);
    }
}

// FUNÇÃO PARA ADICIONAR LISTENERS PARA SALVAMENTO AUTOMÁTICO
function adicionarListenersParaSalvamentoAutomatico() {
    // Lista de IDs dos campos que devem ser salvos automaticamente
    const camposParaSalvar = [
        "destino", "mesAno", "chegada", "traslado",
        "foto01", "foto02", "foto03",
        "hotelServicosCampo",
        "dicasCampo", "valorHotel", "valorAereo", "valorTraslado", "valorSeguro",
        "tituloHospedagemCampo", "hotelCheckinCampo", "hotelCheckoutCampo",
        "descricaoCampo", "enderecoCampo"
    ];

    // Adicionar event listener para cada campo
    camposParaSalvar.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('input', function () {
                salvarCampoNoLocalStorage(id, this.value);
            });
            campo.addEventListener('change', function () {
                salvarCampoNoLocalStorage(id, this.value);
            });
        }
    });
}

// FUNÇÃO PARA SALVAR UM CAMPO NO LOCALSTORAGE
function salvarCampoNoLocalStorage(id, valor) {
    if (!dadosCarregados) return; // Não salvar durante o carregamento inicial

    try {
        localStorage.setItem(id, valor);
        console.log(`Campo ${id} salvo:`, valor);
    } catch (e) {
        console.error(`Erro ao salvar campo ${id}:`, e);
    }
}

// FUNÇÃO PARA ADICIONAR NOVO DESTINO
function adicionarNovoDestino() {
    if (destinoCount >= MAX_DESTINOS) {
        alert(`Limite máximo de ${MAX_DESTINOS} destinos atingido.`);
        return;
    }

    destinoCount++;
    const novoDestino = {
        index: destinoCount,
        nome: "",
        passeios: "",
        dicas: "",
        imagens: []
    };

    adicionarDestinoUI(novoDestino, destinoCount);
    salvarDestinosNoLocalStorage();
    atualizarBotaoDestino();
}

// FUNÇÃO PARA ADICIONAR DESTINO NA UI
function adicionarDestinoUI(destino, index) {
    const container = document.getElementById('multidestinos-container');
    if (!container) return;

    const destinoDiv = document.createElement('div');
    destinoDiv.className = 'destino-item';
    destinoDiv.setAttribute('data-index', index);

    destinoDiv.innerHTML = `
        <h3>Destino ${index}</h3>
        <div class="destino-inputs">
            <label>Nome do Destino:</label>
            <input type="text" class="destino-nome" placeholder="Nome do destino" 
                   value="${destino.nome || ''}" oninput="atualizarDestino(${index}, 'nome', this.value)">
            
            <label>Passeios/Atividades (separados por linha ou ponto):</label>
            <textarea class="destino-passeios" rows="3" placeholder="Lista de passeios..."
                      oninput="atualizarDestino(${index}, 'passeios', this.value)">${destino.passeios || ''}</textarea>
            
            <label>Dicas Locais:</label>
            <textarea class="destino-dicas" rows="2" placeholder="Dicas importantes..."
                      oninput="atualizarDestino(${index}, 'dicas', this.value)">${destino.dicas || ''}</textarea>
        </div>
        
        <div class="destino-carrossel-container" id="destino-carrossel-${index}">
            <h5>Imagens deste Destino (até 8 imagens)</h5>
            <!-- Imagens serão adicionadas aqui -->
        </div>
        
        <button type="button" class="adicionar-imagem-destino-btn" 
                onclick="adicionarNovaImagemDestino(${index})" 
                id="adicionar-imagem-destino-${index}">+ Adicionar imagem</button>
        
        <button type="button" class="remover-destino" onclick="removerDestino(${index})">Remover Destino</button>
    `;

    container.appendChild(destinoDiv);

    // Carregar imagens existentes se houver
    if (destino.imagens && destino.imagens.length > 0) {
        destino.imagens.forEach((imagemSrc, imgIndex) => {
            adicionarCampoImagemDestino(index, imgIndex + 1, imagemSrc);
        });
    } else {
        // Adicionar campo inicial de imagem
        adicionarCampoImagemDestino(index, 1, '');
    }

    atualizarBotaoDestino();
}

// FUNÇÃO PARA ATUALIZAR DESTINO
function atualizarDestino(index, campo, valor) {
    let destinos = [];
    try {
        const destinosJSON = localStorage.getItem('destinosMultiplos');
        destinos = destinosJSON ? JSON.parse(destinosJSON) : [];
    } catch (e) {
        destinos = [];
    }

    // Encontrar ou criar destino
    let destino = destinos.find(d => d.index === index);
    if (!destino) {
        destino = { index: index, nome: "", passeios: "", dicas: "", imagens: [] };
        destinos.push(destino);
    }

    // Atualizar campo
    destino[campo] = valor;

    // Salvar de volta
    localStorage.setItem('destinosMultiplos', JSON.stringify(destinos));
}

// FUNÇÃO PARA ADICIONAR NOVA IMAGEM DESTINO
function adicionarNovaImagemDestino(destinoIndex) {
    const container = document.getElementById(`destino-carrossel-${destinoIndex}`);
    if (!container) return;

    // Contar imagens existentes
    const camposImagem = container.querySelectorAll('.carrossel-imagem-destino');
    const count = camposImagem.length;

    if (count >= MAX_IMAGENS_DESTINO) {
        alert(`Limite máximo de ${MAX_IMAGENS_DESTINO} imagens por destino atingido.`);
        return;
    }

    adicionarCampoImagemDestino(destinoIndex, count + 1, '');
    atualizarBotaoImagemDestino(destinoIndex);
}

// FUNÇÃO PARA ADICIONAR CAMPO DE IMAGEM DESTINO
function adicionarCampoImagemDestino(destinoIndex, imagemIndex, valorInicial) {
    const container = document.getElementById(`destino-carrossel-${destinoIndex}`);
    if (!container) return;

    const campoDiv = document.createElement('div');
    campoDiv.className = 'carrossel-item';
    campoDiv.setAttribute('data-index', imagemIndex);
    campoDiv.setAttribute('data-destino', destinoIndex);

    campoDiv.innerHTML = `
        <h6>Imagem ${imagemIndex}</h6>
        <input type="text" class="carrossel-imagem-destino" 
               placeholder="URL da imagem" 
               value="${valorInicial || ''}"
               oninput="atualizarImagemDestino(${destinoIndex}, ${imagemIndex}, this.value)">
        <button type="button" class="remover-imagem" 
                onclick="removerImagemCarrosselDestino(this, ${destinoIndex})">Remover</button>
    `;

    container.appendChild(campoDiv);
}

// FUNÇÃO PARA ATUALIZAR IMAGEM DESTINO
function atualizarImagemDestino(destinoIndex, imagemIndex, valor) {
    let imagensPorDestino = {};
    try {
        const imagensJSON = localStorage.getItem('carrosselImagensDestinos');
        imagensPorDestino = imagensJSON ? JSON.parse(imagensJSON) : {};
    } catch (e) {
        imagensPorDestino = {};
    }

    if (!imagensPorDestino[destinoIndex]) {
        imagensPorDestino[destinoIndex] = [];
    }

    // Ajustar array para ter espaço suficiente
    while (imagensPorDestino[destinoIndex].length < imagemIndex) {
        imagensPorDestino[destinoIndex].push('');
    }

    imagensPorDestino[destinoIndex][imagemIndex - 1] = valor;

    // Remover elementos vazios do final
    while (imagensPorDestino[destinoIndex].length > 0 && 
           imagensPorDestino[destinoIndex][imagensPorDestino[destinoIndex].length - 1] === '') {
        imagensPorDestino[destinoIndex].pop();
    }

    localStorage.setItem('carrosselImagensDestinos', JSON.stringify(imagensPorDestino));
}

// FUNÇÃO PARA REMOVER IMAGEM DESTINO
function removerImagemCarrosselDestino(botao, destinoIndex) {
    const item = botao.parentElement;
    const imagemIndex = parseInt(item.getAttribute('data-index'));
    
    item.remove();
    
    // Atualizar localStorage
    let imagensPorDestino = {};
    try {
        const imagensJSON = localStorage.getItem('carrosselImagensDestinos');
        imagensPorDestino = imagensJSON ? JSON.parse(imagensJSON) : {};
    } catch (e) {
        imagensPorDestino = {};
    }

    if (imagensPorDestino[destinoIndex]) {
        if (imagensPorDestino[destinoIndex].length >= imagemIndex) {
            imagensPorDestino[destinoIndex].splice(imagemIndex - 1, 1);
        }
        
        // Se array ficar vazio, remover a chave
        if (imagensPorDestino[destinoIndex].length === 0) {
            delete imagensPorDestino[destinoIndex];
        }
        
        localStorage.setItem('carrosselImagensDestinos', JSON.stringify(imagensPorDestino));
    }
    
    atualizarBotaoImagemDestino(destinoIndex);
    
    // Reindexar campos visuais
    const container = document.getElementById(`destino-carrossel-${destinoIndex}`);
    if (container) {
        const campos = container.querySelectorAll('.carrossel-item');
        campos.forEach((campo, index) => {
            campo.setAttribute('data-index', index + 1);
            const h6 = campo.querySelector('h6');
            if (h6) h6.textContent = `Imagem ${index + 1}`;
        });
    }
}

// FUNÇÃO PARA ATUALIZAR BOTÃO DE IMAGEM DESTINO
function atualizarBotaoImagemDestino(destinoIndex) {
    const container = document.getElementById(`destino-carrossel-${destinoIndex}`);
    const botao = document.getElementById(`adicionar-imagem-destino-${destinoIndex}`);
    
    if (!container || !botao) return;
    
    const count = container.querySelectorAll('.carrossel-imagem-destino').length;
    botao.textContent = `+ Adicionar imagem (${count}/${MAX_IMAGENS_DESTINO})`;
    botao.disabled = count >= MAX_IMAGENS_DESTINO;
}

// FUNÇÃO PARA REMOVER DESTINO
function removerDestino(index) {
    const destinoDiv = document.querySelector(`.destino-item[data-index="${index}"]`);
    if (!destinoDiv) return;

    destinoDiv.remove();
    destinoCount--;

    // Atualizar localStorage
    let destinos = [];
    try {
        const destinosJSON = localStorage.getItem('destinosMultiplos');
        destinos = destinosJSON ? JSON.parse(destinosJSON) : [];
    } catch (e) {
        destinos = [];
    }

    // Remover destino
    destinos = destinos.filter(d => d.index !== index);
    
    // Reindexar destinos restantes
    destinos.forEach((destino, i) => {
        destino.index = i + 1;
        
        // Atualizar atributo data-index no DOM
        const destinoDivAtual = document.querySelector(`.destino-item[data-index="${index}"]`);
        if (destinoDivAtual) {
            destinoDivAtual.setAttribute('data-index', i + 1);
        }
    });

    localStorage.setItem('destinosMultiplos', JSON.stringify(destinos));
    
    // Atualizar contagem
    destinoCount = destinos.length;
    
    atualizarBotaoDestino();
    
    // Reindexar visualmente todos os destinos
    const destinosDivs = document.querySelectorAll('.destino-item');
    destinosDivs.forEach((div, i) => {
        const novoIndex = i + 1;
        div.setAttribute('data-index', novoIndex);
        
        const h3 = div.querySelector('h3');
        if (h3) h3.textContent = `Destino ${novoIndex}`;
        
        // Atualizar event listeners nos inputs
        const inputs = div.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.className.includes('destino-nome')) {
                input.oninput = function() { atualizarDestino(novoIndex, 'nome', this.value); };
            } else if (input.className.includes('destino-passeios')) {
                input.oninput = function() { atualizarDestino(novoIndex, 'passeios', this.value); };
            } else if (input.className.includes('destino-dicas')) {
                input.oninput = function() { atualizarDestino(novoIndex, 'dicas', this.value); };
            }
        });
        
        // Atualizar botão de remover
        const removerBtn = div.querySelector('.remover-destino');
        if (removerBtn) {
            removerBtn.onclick = function() { removerDestino(novoIndex); };
        }
        
        // Atualizar botão de adicionar imagem
        const adicionarImagemBtn = div.querySelector('.adicionar-imagem-destino-btn');
        if (adicionarImagemBtn) {
            adicionarImagemBtn.id = `adicionar-imagem-destino-${novoIndex}`;
            adicionarImagemBtn.onclick = function() { adicionarNovaImagemDestino(novoIndex); };
        }
        
        // Atualizar container do carrossel
        const carrosselContainer = div.querySelector('.destino-carrossel-container');
        if (carrosselContainer) {
            carrosselContainer.id = `destino-carrossel-${novoIndex}`;
        }
    });
}

// FUNÇÃO PARA SALVAR DESTINOS NO LOCALSTORAGE
function salvarDestinosNoLocalStorage() {
    const destinos = [];
    
    document.querySelectorAll('.destino-item').forEach(destinoDiv => {
        const index = parseInt(destinoDiv.getAttribute('data-index'));
        const nome = destinoDiv.querySelector('.destino-nome')?.value || '';
        const passeios = destinoDiv.querySelector('.destino-passeios')?.value || '';
        const dicas = destinoDiv.querySelector('.destino-dicas')?.value || '';
        
        destinos.push({
            index: index,
            nome: nome,
            passeios: passeios,
            dicas: dicas,
            imagens: [] // As imagens são salvas separadamente
        });
    });
    
    localStorage.setItem('destinosMultiplos', JSON.stringify(destinos));
}

// FUNÇÃO PARA ATUALIZAR BOTÃO DE DESTINO
function atualizarBotaoDestino() {
    const botao = document.getElementById('adicionar-destino-btn');
    if (botao) {
        botao.textContent = `+ Adicionar novo destino (${destinoCount}/${MAX_DESTINOS})`;
        botao.disabled = destinoCount >= MAX_DESTINOS;
    }
}

// FUNÇÃO PARA ADICIONAR NOVA IMAGEM (HOTEL)
function adicionarNovaImagem(tipo) {
    if (tipo === 'hotel') {
        if (carrosselHotelCount >= MAX_IMAGENS_HOTEL) {
            alert(`Limite máximo de ${MAX_IMAGENS_HOTEL} imagens atingido.`);
            return;
        }
        
        carrosselHotelCount++;
        adicionarCampoImagem(carrosselHotelCount, '', 'hotel');
        atualizarBotaoImagem('hotel');
    }
}

// FUNÇÃO PARA ADICIONAR CAMPO DE IMAGEM
function adicionarCampoImagem(index, valorInicial, tipo) {
    const container = tipo === 'hotel' 
        ? document.getElementById('carrossel-hotel-container')
        : null;
    
    if (!container) return;
    
    const campoDiv = document.createElement('div');
    campoDiv.className = 'carrossel-item';
    campoDiv.setAttribute('data-index', index);
    
    campoDiv.innerHTML = `
        <h4>Imagem ${index}</h4>
        <input type="text" class="carrossel-imagem" 
               placeholder="URL da imagem" 
               value="${valorInicial || ''}"
               oninput="atualizarImagemCarrossel(${index}, this.value, '${tipo}')">
        <button type="button" class="remover-imagem" 
                onclick="removerImagemCarrossel(this, '${tipo}')">Remover</button>
    `;
    
    container.appendChild(campoDiv);
}

// FUNÇÃO PARA CARREGAR IMAGENS DO CARROSSEL
function carregarImagensCarrossel(imagens, tipo) {
    if (tipo === 'hotel') {
        const container = document.getElementById('carrossel-hotel-container');
        if (!container) return;
        
        // Limpar campos existentes (exceto o primeiro)
        const camposExistentes = container.querySelectorAll('.carrossel-item');
        camposExistentes.forEach((campo, index) => {
            if (index > 0) campo.remove();
        });
        
        // Atualizar primeiro campo se existir imagem
        const primeiroCampo = container.querySelector('.carrossel-item');
        if (primeiroCampo && imagens[0]) {
            const input = primeiroCampo.querySelector('.carrossel-imagem');
            if (input) input.value = imagens[0];
        }
        
        // Adicionar campos para as demais imagens
        for (let i = 1; i < imagens.length; i++) {
            carrosselHotelCount = i + 1;
            adicionarCampoImagem(carrosselHotelCount, imagens[i], 'hotel');
        }
        
        atualizarBotaoImagem('hotel');
    }
}

// FUNÇÃO PARA CARREGAR IMAGENS DO CARROSSEL DESTINO
function carregarImagensCarrosselDestino(destinoIndex, imagens) {
    const container = document.getElementById(`destino-carrossel-${destinoIndex}`);
    if (!container) return;
    
    // Limpar campos existentes
    container.innerHTML = '<h5>Imagens deste Destino (até 8 imagens)</h5>';
    
    // Adicionar campos para cada imagem
    imagens.forEach((imagemSrc, index) => {
        adicionarCampoImagemDestino(destinoIndex, index + 1, imagemSrc);
    });
    
    atualizarBotaoImagemDestino(destinoIndex);
}

// FUNÇÃO PARA ATUALIZAR IMAGEM DO CARROSSEL
function atualizarImagemCarrossel(index, valor, tipo) {
    let imagens = [];
    
    if (tipo === 'hotel') {
        try {
            const imagensJSON = localStorage.getItem('carrosselImagensHotel');
            imagens = imagensJSON ? JSON.parse(imagensJSON) : [];
        } catch (e) {
            imagens = [];
        }
        
        // Ajustar array para ter espaço suficiente
        while (imagens.length < index) {
            imagens.push('');
        }
        
        imagens[index - 1] = valor;
        
        // Remover elementos vazios do final
        while (imagens.length > 0 && imagens[imagens.length - 1] === '') {
            imagens.pop();
        }
        
        localStorage.setItem('carrosselImagensHotel', JSON.stringify(imagens));
    }
}

// FUNÇÃO PARA REMOVER IMAGEM DO CARROSSEL
function removerImagemCarrossel(botao, tipo) {
    const item = botao.parentElement;
    const index = parseInt(item.getAttribute('data-index'));
    
    item.remove();
    
    if (tipo === 'hotel') {
        carrosselHotelCount--;
        
        // Atualizar localStorage
        let imagens = [];
        try {
            const imagensJSON = localStorage.getItem('carrosselImagensHotel');
            imagens = imagensJSON ? JSON.parse(imagensJSON) : [];
        } catch (e) {
            imagens = [];
        }
        
        if (imagens.length >= index) {
            imagens.splice(index - 1, 1);
        }
        
        localStorage.setItem('carrosselImagensHotel', JSON.stringify(imagens));
        
        atualizarBotaoImagem('hotel');
        
        // Reindexar campos visuais
        const container = document.getElementById('carrossel-hotel-container');
        if (container) {
            const campos = container.querySelectorAll('.carrossel-item');
            campos.forEach((campo, i) => {
                const novoIndex = i + 1;
                campo.setAttribute('data-index', novoIndex);
                const h4 = campo.querySelector('h4');
                if (h4) h4.textContent = `Imagem ${novoIndex}`;
                
                // Atualizar event listener
                const input = campo.querySelector('.carrossel-imagem');
                if (input) {
                    input.oninput = function() { atualizarImagemCarrossel(novoIndex, this.value, 'hotel'); };
                }
                
                // Atualizar botão remover
                const removerBtn = campo.querySelector('.remover-imagem');
                if (removerBtn) {
                    removerBtn.onclick = function() { removerImagemCarrossel(this, 'hotel'); };
                }
            });
        }
    }
}

// FUNÇÃO PARA ATUALIZAR BOTÃO DE IMAGEM
function atualizarBotaoImagem(tipo) {
    if (tipo === 'hotel') {
        const botao = document.getElementById('adicionar-imagem-hotel-btn');
        if (botao) {
            botao.textContent = `+ Adicionar imagem (${carrosselHotelCount}/${MAX_IMAGENS_HOTEL})`;
            botao.disabled = carrosselHotelCount >= MAX_IMAGENS_HOTEL;
        }
    }
}

// FUNÇÃO PARA LIMPAR FORMULÁRIO
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todo o formulário? Todos os dados serão perdidos.')) {
        // Limpar todos os campos do formulário
        document.querySelectorAll('input, textarea').forEach(campo => {
            campo.value = '';
        });
        
        // Limpar destinos dinâmicos
        const container = document.getElementById('multidestinos-container');
        if (container) {
            container.innerHTML = '';
        }
        
        // Limpar carrossel do hotel (exceto o primeiro campo)
        const carrosselHotel = document.getElementById('carrossel-hotel-container');
        if (carrosselHotel) {
            const primeiroItem = carrosselHotel.querySelector('.carrossel-item');
            carrosselHotel.innerHTML = '';
            if (primeiroItem) {
                const input = primeiroItem.querySelector('.carrossel-imagem');
                if (input) input.value = '';
                carrosselHotel.appendChild(primeiroItem);
            }
        }
        
        // Resetar contadores
        destinoCount = 0;
        carrosselHotelCount = 1;
        
        // Limpar localStorage
        localStorage.clear();
        
        // Atualizar botões
        atualizarBotaoDestino();
        atualizarBotaoImagem('hotel');
        
        alert('Formulário limpo com sucesso!');
    }
}

// FUNÇÃO PARA HANDLE SUBMIT DO FORMULÁRIO
function handleSubmit(event) {
    event.preventDefault();
    
    console.log("Gerando proposta...");
    
    // Salvar todos os dados antes de gerar a proposta
    salvarTodosOsDados();
    
    // Coletar todos os dados do formulário
    const dados = {};
    
    // Campos básicos
    const camposBasicos = [
        "destino", "mesAno", "chegada", "traslado",
        "foto01", "foto02", "foto03",
        "hotelServicosCampo", "dicasCampo",
        "valorHotel", "valorAereo", "valorTraslado", "valorSeguro",
        "tituloHospedagemCampo", "hotelCheckinCampo", "hotelCheckoutCampo",
        "descricaoCampo", "enderecoCampo"
    ];
    
    camposBasicos.forEach(id => {
        const el = document.getElementById(id);
        if (el) dados[id] = el.value;
    });
    
    // Destinos múltiplos
    try {
        const destinosJSON = localStorage.getItem('destinosMultiplos');
        dados.destinosMultiplos = destinosJSON || "[]";
    } catch (e) {
        dados.destinosMultiplos = "[]";
    }
    
    // Imagens do hotel
    try {
        const hotelImagens = localStorage.getItem('carrosselImagensHotel');
        dados.carrosselImagensHotel = hotelImagens || "[]";
    } catch (e) {
        dados.carrosselImagensHotel = "[]";
    }
    
    // Imagens dos destinos
    try {
        const destinosImagens = localStorage.getItem('carrosselImagensDestinos');
        dados.carrosselImagensDestinos = destinosImagens || "{}";
    } catch (e) {
        dados.carrosselImagensDestinos = "{}";
    }
    
    // Gerar ID único para esta proposta
    const propostaId = 'proposta_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Salvar no localStorage com ID curto
    localStorage.setItem(propostaId, JSON.stringify(dados));
    
    // Criar link curto
    const url = `proposta.html?id=${propostaId.split('_')[1]}`;
    
    // Redirecionar para a proposta
    window.open(url, '_blank');
}

// FUNÇÃO PARA SALVAR TODOS OS DADOS
function salvarTodosOsDados() {
    // Campos básicos já são salvos automaticamente pelos listeners
    
    // Forçar salvamento dos destinos
    salvarDestinosNoLocalStorage();
    
    console.log("Todos os dados salvos no localStorage");
}