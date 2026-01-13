// script-proposta.js
import { buscarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("📄 Proposta carregada");

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
    // HELPERS (SEGUROS)
    // ===============================
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "";
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
    // CARROSSEL HOTEL (ROBUSTO)
    // ===============================
    let currentIndex = 0;
    const images = Array.isArray(dados.carrosselImagensHotel)
        ? dados.carrosselImagensHotel.filter(Boolean)
        : [];

    const container = document.getElementById("carrossel-images-hotel");
    const dots = document.getElementById("carrossel-dots-hotel");
    const counter = document.getElementById("carrossel-counter-hotel");

    function renderCarousel() {
        if (!container || images.length === 0) return;

        container.innerHTML = "";
        if (dots) dots.innerHTML = "";

        images.forEach((url, i) => {
            const img = document.createElement("img");
            img.src = url;
            img.className = "carrossel-image" + (i === currentIndex ? " active" : "");
            container.appendChild(img);

            if (dots) {
                const dot = document.createElement("span");
                dot.className = "carrossel-dot" + (i === currentIndex ? " active" : "");
                dot.onclick = () => {
                    currentIndex = i;
                    renderCarousel();
                };
                dots.appendChild(dot);
            }
        });

        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        }
    }

    window.prevSlideHotel = () => {
        if (!images.length) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        renderCarousel();
    };

    window.nextSlideHotel = () => {
        if (!images.length) return;
        currentIndex = (currentIndex + 1) % images.length;
        renderCarousel();
    };

    renderCarousel();

    console.log("✅ Proposta renderizada com sucesso");
});

