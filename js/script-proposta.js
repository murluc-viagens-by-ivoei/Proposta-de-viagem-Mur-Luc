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
    // FUNÇÕES AUXILIARES
    // ===============================
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el && value) el.textContent = value;
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
    // CARROSSEL HOTEL
    // ===============================
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

    // ===============================
    // DESTINOS MÚLTIPLOS
    // ===============================
    const destinosContainer = document.getElementById("destinos-container");

    if (dados.destinosMultiplos?.length) {
        dados.destinosMultiplos.forEach(destino => {
            const div = document.createElement("div");
            div.className = "destino-pagina page";
            div.style.display = "block";

            div.innerHTML = `
                <h2 class="destino-nome-titulo">${destino.nome}</h2>
                <div class="destino-container">
                    ${destino.passeios ? `<div class="lista-passeios">${destino.passeios}</div>` : ""}
                    ${destino.dicas ? `<div class="dicas">${destino.dicas}</div>` : ""}
                </div>
            `;

            destinosContainer.appendChild(div);
        });
    }

    // ===============================
    // VALORES
    // ===============================
    const itemsList = document.getElementById("itemsList");
    if (itemsList) {
        const valores = [
            { label: "Hotel", value: dados.valorHotel },
            { label: "Passagem aérea", value: dados.valorAereo },
            { label: "Traslado", value: dados.valorTraslado },
            { label: "Seguro viagem", value: dados.valorSeguro }
        ];

        valores.forEach(item => {
            if (item.value) {
                const row = document.createElement("div");
                row.className = "row";
                row.innerHTML = `
                    <span class="label">${item.label}</span>
                    <div class="dots"></div>
                    <span class="price">R$ ${parseFloat(item.value).toFixed(2)}</span>
                `;
                itemsList.appendChild(row);
            }
        });

        const total = valores.reduce((acc, i) => acc + (parseFloat(i.value) || 0), 0);
        const totalRow = document.createElement("div");
        totalRow.className = "row total";
        totalRow.innerHTML = `
            <span class="label">TOTAL</span>
            <div class="dots"></div>
            <span class="price">R$ ${total.toFixed(2)}</span>
        `;
        itemsList.appendChild(totalRow);
    }

});
