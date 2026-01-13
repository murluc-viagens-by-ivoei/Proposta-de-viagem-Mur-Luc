// script-proposta.js
import { buscarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("Proposta não encontrada (ID ausente)");
        return;
    }

    const dados = await buscarProposta(id);

    if (!dados) {
        alert("Proposta não encontrada no banco");
        return;
    }

    // ===============================
    // HELPERS
    // ===============================
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "";
    };

    const setImg = (id, url) => {
        const img = document.getElementById(id);
        if (img && url) img.src = url;
    };

    // ===============================
    // DADOS PRINCIPAIS
    // ===============================
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

    // ===============================
    // CARROSSEL HOTEL (CORRIGIDO)
    // ===============================
    let currentIndexHotel = 0;
    const hotelImages = Array.isArray(dados.carrosselImagensHotel)
        ? dados.carrosselImagensHotel.filter(Boolean)
        : [];

    const hotelContainer = document.getElementById("carrossel-images-hotel");
    const hotelDots = document.getElementById("carrossel-dots-hotel");
    const hotelCounter = document.getElementById("carrossel-counter-hotel");

    function renderCarouselHotel() {
        if (!hotelContainer || hotelImages.length === 0) return;

        hotelContainer.innerHTML = "";
        if (hotelDots) hotelDots.innerHTML = "";

        hotelImages.forEach((url, i) => {
            const img = document.createElement("img");
            img.src = url;
            img.className = "carrossel-image" + (i === currentIndexHotel ? " active" : "");
            hotelContainer.appendChild(img);

            if (hotelDots) {
                const dot = document.createElement("span");
                dot.className = "carrossel-dot" + (i === currentIndexHotel ? " active" : "");
                dot.onclick = () => {
                    currentIndexHotel = i;
                    renderCarouselHotel();
                };
                hotelDots.appendChild(dot);
            }
        });

        if (hotelCounter) {
            hotelCounter.textContent = `${currentIndexHotel + 1} / ${hotelImages.length}`;
        }
    }

    window.prevSlideHotel = () => {
        if (hotelImages.length === 0) return;
        currentIndexHotel =
            (currentIndexHotel - 1 + hotelImages.length) % hotelImages.length;
        renderCarouselHotel();
    };

    window.nextSlideHotel = () => {
        if (hotelImages.length === 0) return;
        currentIndexHotel =
            (currentIndexHotel + 1) % hotelImages.length;
        renderCarouselHotel();
    };

    renderCarouselHotel();

    // ===============================
    // DESTINOS MÚLTIPLOS
    // ===============================
    const destinosContainer = document.getElementById("destinos-container");

    if (destinosContainer && Array.isArray(dados.destinosMultiplos)) {
        dados.destinosMultiplos.forEach((destino, index) => {
            criarDestinoCard(destino, index);
        });
    }

    function criarDestinoCard(destino, index) {
        const div = document.createElement("div");
        div.className = "page destino-pagina";

        div.innerHTML = `
            <img src="./assets/logo.png" class="logo">
            <h1>Destino ${index + 1}: ${destino.nome || ""}</h1>
            <div class="bloco">
                <h2>Passeios</h2>
                <p>${destino.passeios || ""}</p>
            </div>
        `;

        destinosContainer.appendChild(div);
    }
});
