import { salvarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCotacao");
    if (!form) return;

    // ===== SUBMIT FORMULÁRIO =====
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

        // ===== CARROSSEL HOTEL =====
        document.querySelectorAll(".carrossel-imagem").forEach(img => {
            if (img.value.trim()) dados.carrosselImagensHotel.push(img.value.trim());
        });

        // ===== MULTI DESTINOS =====
        document.querySelectorAll(".destino-item").forEach((destinoDiv, index) => {
            const nome = destinoDiv.querySelector(".destino-nome")?.value.trim() || "";
            const passeios = destinoDiv.querySelector(".destino-passeios")?.value.trim() || "";
            const dicas = destinoDiv.querySelector(".destino-dicas")?.value.trim() || "";
            if (nome || passeios || dicas) dados.destinosMultiplos.push({ index: index + 1, nome, passeios, dicas });
        });

        try {
            const id = await salvarProposta(dados);
            window.location.href = `proposta.html?id=${id}`;
        } catch (err) {
            console.error(err);
            alert("Erro ao gerar proposta. Tente novamente.");
        }
    });

    // ===== LIMPAR FORMULÁRIO =====
    const limparBtn = document.getElementById("limparFormularioBtn");
    if (limparBtn) limparBtn.addEventListener("click", () => form.reset());

    // ===== ADICIONAR IMAGEM HOTEL =====
    const adicionarImagemBtn = document.getElementById("adicionar-imagem-hotel-btn");
    adicionarImagemBtn.addEventListener("click", () => {
        const container = document.getElementById("carrossel-hotel-container");
        const count = container.querySelectorAll(".carrossel-item").length;
        if (count >= 8) return alert("Máximo de 8 imagens.");

        const div = document.createElement("div");
        div.className = "carrossel-item";
        div.innerHTML = `
            <h4>Imagem ${count + 1}</h4>
            <input type="text" class="carrossel-imagem" placeholder="URL da imagem">
            <button type="button" class="remover-imagem">Remover</button>
        `;
        container.appendChild(div);
        div.querySelector(".remover-imagem").addEventListener("click", () => div.remove());
    });

    // ===== ADICIONAR DESTINO =====
    const adicionarDestinoBtn = document.getElementById("adicionar-destino-btn");
    adicionarDestinoBtn.addEventListener("click", () => {
        const container = document.getElementById("multidestinos-container");
        const count = container.querySelectorAll(".destino-item").length;
        if (count >= 20) return alert("Máximo de 20 destinos.");

        const div = document.createElement("div");
        div.className = "destino-item";
        div.innerHTML = `
            <h3>Destino ${count + 1}</h3>
            <div class="destino-inputs">
                <label>Nome:</label>
                <input type="text" class="destino-nome">
                <label>Passeios:</label>
                <textarea class="destino-passeios" rows="3"></textarea>
                <label>Dicas:</label>
                <textarea class="destino-dicas" rows="2"></textarea>
                <button type="button" class="remover-destino">Remover Destino</button>
            </div>
        `;
        container.appendChild(div);
        div.querySelector(".remover-destino").addEventListener("click", () => div.remove());
    });

    // ===== REMOVER IMAGENS EXISTENTES =====
    document.querySelectorAll(".remover-imagem").forEach(btn => {
        btn.addEventListener("click", e => e.target.parentElement.remove());
    });
});
