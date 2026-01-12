// script-proposta.js
import { buscarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("📄 Proposta carregada");

    // Captura o ID da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("Proposta não encontrada (ID ausente)");
        return;
    }

    // Busca os dados do Supabase
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
        if (el) el.textContent = value || "-";
    };

    const setImg = (id, url) => {
        const img = document.getElementById(id);
        if (img) {
            if (url) {
                img.src = url;
                img.style.display = "block";
            } else {
                img.style.display = "none";
            }
        }
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

    // ===============================
    // CARROSSEL HOTEL
    // ===============================
    const container = document.getElementById("carrossel-images-hotel");
    const dots = document.getElementById("carrossel-dots-hotel");
    const counter = document.getElementById("carrossel-counter-hotel");

    let currentIndex = 0;
    const images = (dados.carrosselImagensHotel || []).filter(Boolean);

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
    // DESTINOS MULTIPLOS
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
    // DICAS GERAIS
    // ===============================
    setText("dicasCampo", dados.dicasCampo);

    // ===============================
    // VALORES
    // ===============================
    const itemsList = document.getElementById("itemsList");
    if (itemsList) {
        const valores = [
            { label: "Hotel", valor: dados.valorHotel },
            { label: "Passagem Aérea", valor: dados.valorAereo },
            { label: "Traslado", valor: dados.valorTraslado },
            { label: "Seguro Viagem", valor: dados.valorSeguro },
        ];

        itemsList.innerHTML = valores.map(v => `
            <div class="row">
                <span class="label">${v.label}</span>
                <span class="dots"></span>
                <span class="price">R$ ${v.valor || "0,00"}</span>
            </div>
        `).join("");

        // Total
        const total = valores.reduce((acc, v) => acc + Number(v.valor || 0), 0);
        const divTotal = document.createElement("div");
        divTotal.className = "row total";
        divTotal.innerHTML = `
            <span class="label">TOTAL</span>
            <span class="dots"></span>
            <span class="price">R$ ${total.toFixed(2)}</span>
        `;
        itemsList.appendChild(divTotal);
    }

    console.log("✅ Proposta renderizada com sucesso");
});
