import { buscarProposta } from "./js/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return alert("ID da proposta não encontrado");

    const dados = await buscarProposta(id);
    if (!dados) return alert("Proposta não encontrada");

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
    setImg("imgSlide1", dados.foto01); 
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
    const images = Array.isArray(dados.carrosselImagensHotel)
        ? dados.carrosselImagensHotel.filter(Boolean)
        : [];

    let currentIndex = 0;

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

    // ===============================
    // DESTINOS MÚLTIPLOS
    // ===============================
    const destinosContainer = document.getElementById("destinos-container");

    if (Array.isArray(dados.destinosMultiplos)) {
        dados.destinosMultiplos.forEach((destino, index) => {
            const page = document.createElement("div");
            page.className = "page destino-pagina";

            page.innerHTML = `
                <img src="./assets/logo.png" class="logo">
                <h1>Destino ${index + 1}: ${destino.nome || ""}</h1>

                <div class="bloco">
                    <h2>Passeios</h2>
                    <p>${destino.passeios || ""}</p>
                </div>

                <div class="bloco">
                    <h2>Dicas</h2>
                    <p>${destino.dicas || ""}</p>
                </div>

                <div class="rodape">
                    <img src="./assets/rodape.png">
                </div>
            `;

            // Carrossel do destino
            if (Array.isArray(destino.carrosselImagensDestino) && destino.carrosselImagensDestino.length > 0) {
                const imgs = destino.carrosselImagensDestino.filter(Boolean);
                let idx = 0;

                const car = document.createElement("div");
                car.className = "carrossel";

                const imgsDiv = document.createElement("div");
                imgsDiv.className = "carrossel-images";

                const ctr = document.createElement("div");
                ctr.className = "carrossel-counter";

                function renderDestino() {
                    imgsDiv.innerHTML = "";
                    const img = document.createElement("img");
                    img.src = imgs[idx];
                    img.className = "carrossel-image active";
                    imgsDiv.appendChild(img);
                    ctr.textContent = `${idx + 1} / ${imgs.length}`;
                }

                renderDestino();
                car.appendChild(imgsDiv);
                car.appendChild(ctr);
                page.insertBefore(car, page.children[2]);
            }

            destinosContainer.appendChild(page);
        });
    }

    console.log("✅ Proposta renderizada com sucesso");
});


