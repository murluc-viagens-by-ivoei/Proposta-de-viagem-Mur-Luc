// script-proposta.js
import { buscarProposta } from "./js/storage.js";

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
    // HELPERS
    // ===============================
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "";
    };

    const setImg = (id, url) => {
        const img = document.getElementById(id);
        if (img) img.src = url || "";
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
    // CARROSSEL HOTEL
    // ===============================
    let currentIndexHotel = 0;
    const hotelImages = (dados.carrosselImagensHotel || []).filter(Boolean);

    const hotelContainer = document.getElementById("carrossel-images-hotel");
    const hotelDots = document.getElementById("carrossel-dots-hotel");
    const hotelCounter = document.getElementById("carrossel-counter-hotel");

    function renderHotelCarousel() {
        if (!hotelContainer || hotelImages.length === 0) return;

        hotelContainer.innerHTML = "";
        hotelDots.innerHTML = "";

        hotelImages.forEach((url, i) => {
            const img = document.createElement("img");
            img.src = url;
            img.className = "carrossel-image" + (i === currentIndexHotel ? " active" : "");
            hotelContainer.appendChild(img);

            const dot = document.createElement("span");
            dot.className = "carrossel-dot" + (i === currentIndexHotel ? " active" : "");
            dot.onclick = () => {
                currentIndexHotel = i;
                renderHotelCarousel();
            };
            hotelDots.appendChild(dot);
        });

        hotelCounter.textContent = `${currentIndexHotel + 1} / ${hotelImages.length}`;
    }

    window.prevSlideHotel = () => {
        currentIndexHotel = (currentIndexHotel - 1 + hotelImages.length) % hotelImages.length;
        renderHotelCarousel();
    };

    window.nextSlideHotel = () => {
        currentIndexHotel = (currentIndexHotel + 1) % hotelImages.length;
        renderHotelCarousel();
    };

    renderHotelCarousel();

    // ===============================
    // DESTINOS MÚLTIPLOS (COM URL)
    // ===============================
    const destinosContainer = document.getElementById("destinos-container");

    if (dados.destinosMultiplos && dados.destinosMultiplos.length > 0) {
        dados.destinosMultiplos.forEach((destino, index) => {
            const page = document.createElement("div");
            page.className = "page destino-pagina";

            page.innerHTML = `
                <img src="assets/logo.png" class="logo" alt="Logo">
                <h1>${destino.nome || ""}</h1>
                <p><strong>Passeios:</strong> ${destino.passeios || ""}</p>
                <p><strong>Dicas:</strong> ${destino.dicas || ""}</p>
            `;

            // Carrossel do destino
            if (destino.carrosselImagensDestino?.length) {
                let idx = 0;
                const imgs = destino.carrosselImagensDestino.filter(Boolean);

                const carrossel = document.createElement("div");
                carrossel.className = "carrossel";

                const imagesDiv = document.createElement("div");
                imagesDiv.className = "carrossel-images";

                const dotsDiv = document.createElement("div");
                dotsDiv.className = "carrossel-dots";

                const counterDiv = document.createElement("div");
                counterDiv.className = "carrossel-counter";

                function render() {
                    imagesDiv.innerHTML = "";
                    dotsDiv.innerHTML = "";

                    imgs.forEach((url, i) => {
                        const img = document.createElement("img");
                        img.src = url;
                        img.className = "carrossel-image" + (i === idx ? " active" : "");
                        imagesDiv.appendChild(img);

                        const dot = document.createElement("span");
                        dot.className = "carrossel-dot" + (i === idx ? " active" : "");
                        dot.onclick = () => {
                            idx = i;
                            render();
                        };
                        dotsDiv.appendChild(dot);
                    });

                    counterDiv.textContent = `${idx + 1} / ${imgs.length}`;
                }

                const prev = document.createElement("button");
                prev.className = "carrossel-prev";
                prev.innerText = "❮";
                prev.onclick = () => {
                    idx = (idx - 1 + imgs.length) % imgs.length;
                    render();
                };

                const next = document.createElement("button");
                next.className = "carrossel-next";
                next.innerText = "❯";
                next.onclick = () => {
                    idx = (idx + 1) % imgs.length;
                    render();
                };

                const controls = document.createElement("div");
                controls.className = "carrossel-controls";
                controls.append(prev, dotsDiv, next);

                carrossel.append(imagesDiv, controls, counterDiv);
                page.appendChild(carrossel);
                render();
            }

            destinosContainer.appendChild(page);
        });
    }

    console.log("✅ Proposta renderizada com destinos e imagens");
});
