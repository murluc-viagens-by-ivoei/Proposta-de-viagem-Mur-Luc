import { salvarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCotacao");
    if (!form) return;

    // =========================
    // CARROSSEL DE IMAGENS DO HOTEL
    // =========================
    const carrosselContainer = document.getElementById("carrossel-hotel-container");
    const adicionarImagemBtn = document.getElementById("adicionar-imagem-hotel-btn");

    function atualizarTextoBotao() {
        const total = carrosselContainer.querySelectorAll(".carrossel-imagem").length;
        adicionarImagemBtn.textContent = `+ Adicionar imagem (${total}/8)`;
        adicionarImagemBtn.disabled = total >= 8;
    }

    window.removerImagemCarrossel = (btn, tipo) => {
        btn.parentElement.remove();
        atualizarTextoBotao();
    };

    adicionarImagemBtn.addEventListener("click", () => {
        const total = carrosselContainer.querySelectorAll(".carrossel-imagem").length;
        if (total >= 8) return;

        const div = document.createElement("div");
        div.className = "carrossel-item";
        div.dataset.index = total + 1;
        div.innerHTML = `
            <h4>Imagem ${total + 1}</h4>
            <input type="text" class="carrossel-imagem" placeholder="URL da imagem">
            <button type="button" class="remover-imagem">Remover</button>
        `;
        div.querySelector(".remover-imagem").onclick = () => {
            div.remove();
            atualizarTextoBotao();
        };
        carrosselContainer.appendChild(div);
        atualizarTextoBotao();
    });

    atualizarTextoBotao();

    // =========================
    // MULTI DESTINOS
    // =========================
    const destinosContainer = document.getElementById("multidestinos-container");
    const adicionarDestinoBtn = document.getElementById("adicionar-destino-btn");

    function criarDestino(index) {
        const div = document.createElement("div");
        div.className = "destino-item";
        div.dataset.index = index;
        div.innerHTML = `
            <h3>Destino ${index}</h3>
            <div class="destino-inputs">
                <label>Nome do destino:</label>
                <input type="text" class="destino-nome">
                <label>Passeios:</label>
                <textarea class="destino-passeios" rows="3"></textarea>
                <label>Dicas:</label>
                <textarea class="destino-dicas" rows="3"></textarea>
            </div>
            <button type="button" class="remover-destino">Remover Destino</button>
        `;
        div.querySelector(".remover-destino").onclick = () => {
            div.remove();
            atualizarTextoDestinos();
        };
        return div;
    }

    function atualizarTextoDestinos() {
        const total = destinosContainer.querySelectorAll(".destino-item").length;
        adicionarDestinoBtn.textContent = `+ Adicionar novo destino (${total}/20)`;
        adicionarDestinoBtn.disabled = total >= 20;
    }

    adicionarDestinoBtn.addEventListener("click", () => {
        const total = destinosContainer.querySelectorAll(".destino-item").length;
        if (total >= 20) return;
        const div = criarDestino(total + 1);
        destinosContainer.appendChild(div);
        atualizarTextoDestinos();
    });

    atualizarTextoDestinos();

    // =========================
    // SALVAR FORMULÁRIO
    // =========================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = {
            destino: document.getElementById("destino")?.value.trim() || "",
            mesAno: document.getElementById("mesAno")?.value.trim() || "",
            chegada: document.getElementById("chegada")?.value.trim() || "",
            traslado: document.getElementById("traslado")?.value.trim() || "",
            foto01: document.getElementById("foto01")?.value.trim() || "",
            foto02: document.getElementById("foto02")?.value.trim() || "",
            foto03: document.getElementById("foto03")?.value.trim() || "",
            tituloHospedagemCampo: document.getElementById("tituloHospedagemCampo")?.value.trim() || "",
            hotelCheckinCampo: document.getElementById("hotelCheckinCampo")?.value.trim() || "",
            hotelCheckoutCampo: document.getElementById("hotelCheckoutCampo")?.value.trim() || "",
            enderecoCampo: document.getElementById("enderecoCampo")?.value.trim() || "",
            descricaoCampo: document.getElementById("descricaoCampo")?.value.trim() || "",
            hotelServicosCampo: document.getElementById("hotelServicosCampo")?.value.trim() || "",
            dicasCampo: document.getElementById("dicasCampo")?.value.trim() || "",
            valorHotel: document.getElementById("valorHotel")?.value.trim() || "",
            valorAereo: document.getElementById("valorAereo")?.value.trim() || "",
            valorTraslado: document.getElementById("valorTraslado")?.value.trim() || "",
            valorSeguro: document.getElementById("valorSeguro")?.value.trim() || "",
            carrosselImagensHotel: [],
            destinosMultiplos: []
        };

        // Carrossel de imagens
        carrosselContainer.querySelectorAll(".carrossel-imagem").forEach(img => {
            if (img.value.trim()) dados.carrosselImagensHotel.push(img.value.trim());
        });

        // Destinos múltiplos
        destinosContainer.querySelectorAll(".destino-item").forEach((div, index) => {
            const nome = div.querySelector(".destino-nome")?.value.trim() || "";
            const passeios = div.querySelector(".destino-passeios")?.value.trim() || "";
            const dicas = div.querySelector(".destino-dicas")?.value.trim() || "";
            if (nome || passeios || dicas) {
                dados.destinosMultiplos.push({ index: index + 1, nome, passeios, dicas });
            }
        });

        try {
            const id = await salvarProposta(dados);
            window.location.href = `proposta.html?id=${id}`;
        } catch (err) {
            console.error("Erro ao salvar proposta:", err);
            alert("Erro ao gerar proposta. Tente novamente.");
        }
    });

    // =========================
    // LIMPAR FORMULÁRIO
    // =========================
    const limparBtn = document.getElementById("limparFormularioBtn");
    if (limparBtn) {
        limparBtn.addEventListener("click", () => form.reset());
    }
});