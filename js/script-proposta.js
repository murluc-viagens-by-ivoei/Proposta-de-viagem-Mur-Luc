import { buscarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("📄 Proposta carregada");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return alert("Proposta não encontrada (ID ausente)");

    const dados = await buscarProposta(id);
    if (!dados) return alert("Proposta não encontrada no banco");

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el && value) el.textContent = value;
    };

    const setImg = (id, url) => {
        const img = document.getElementById(id);
        if (img && url) img.src = url;
    };

    // ===== DADOS PRINCIPAIS =====
    setText("destinoCampo", dados.destino);
    setText("mesAnoCampo", dados.mesAno);
    setText("chegadaCampo", dados.chegada);
    setText("trasladoCampo", dados.traslado);

    setImg("imgFoto01", dados.foto01);
    setImg("imgFoto02", dados.foto02);
    setImg("imgFoto03", dados.foto03);

    setText("tituloHospedagemCampo", dados.tituloHospedagemCampo);
    setText("hotelCheckinCampo", dados.hotelCheckinCampo);
    setText("hotelCheckoutCampo", dados.hotelCheckoutCampo);
    setText("descricaoCampo", dados.descricaoCampo);
    setText("hotelServicosCampo", dados.hotelServicosCampo);
    setText("enderecoCampo", dados.enderecoCampo);
    setText("dicasCampo", dados.dicasCampo);

    // ===== CARROSSEL HOTEL =====
    let currentIndex = 0;
    const images = (dados.carrosselImagensHotel || []).filter(Boolean);
    const container = document.getElementById("carrossel-images-hotel");
    const dots = document.getElementById("carrossel-dots-hotel");
    const counter = document.getElementById("carrossel-counter-hotel");

    function renderCarousel() {
        if (!container || images.length === 0) return;

        container.innerHTML = "";
        dots.innerHTML = "";

        images.forEach((url, i) => {
            const img = document.createElement("img");
            img.src = url;
            img.className = "carrossel-image" + (i === currentIndex ? " active" : "");
            container.appendChild(img);

            const dot = document.createElement("span");
            dot.className = "carrossel-dot" + (i === currentIndex ? " active" : "");
            dot.onclick = () => {
                currentIndex = i;
                renderCarousel();
            };
            dots.appendChild(dot);
        });

        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    window.prevSlideHotel = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        renderCarousel();
    };

    window.nextSlideHotel = () => {
        currentIndex = (currentIndex + 1) % images.length;
        renderCarousel();
    };

    renderCarousel();

    // ===== DESTINOS MÚLTIPLOS =====
    const destinosContainer = document.getElementById("destinos-container");
    if (dados.destinosMultiplos?.length) {
        dados.destinosMultiplos.forEach((destino, index) => {
            const div = document.createElement("div");
            div.className = "page destino-pagina";
            div.innerHTML = `
                <img src="assets/logo.png" class="logo" alt="Logo">
                <h1 class="destino-nome-titulo">Destino ${destino.index}: ${destino.nome}</h1>
                <div class="destino-container">
                    <div class="lista-passeios">${destino.passeios}</div>
                    <div class="dicas">${destino.dicas}</div>
                </div>
                <div class="rodape"><img src="assets/rodape.png" alt="Rodapé"></div>
            `;
            destinosContainer.appendChild(div);
        });
    }

    // ===== VALORES =====
    const itemsList = document.getElementById("itemsList");
    const valores = [
        { label: "Hotel", valor: dados.valorHotel },
        { label: "Aéreo", valor: dados.valorAereo },
        { label: "Traslado", valor: dados.valorTraslado },
        { label: "Seguro", valor: dados.valorSeguro },
    ];
    valores.forEach(item => {
        if (item.valor) {
            const row = document.createElement("div");
            row.className = "row";
            row.innerHTML = `<span class="label">${item.label}</span><span class="dots"></span><span class="price">R$ ${item.valor}</span>`;
            itemsList.appendChild(row);
        }
    });

    console.log("✅ Proposta renderizada com sucesso");
});
