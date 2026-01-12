import { salvarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCotacao");
    const multidestinosContainer = document.getElementById("multidestinos-container");
    const adicionarDestinoBtn = document.getElementById("adicionar-destino-btn");
    const carrosselContainer = document.getElementById("carrossel-hotel-container");
    const adicionarImagemBtn = document.getElementById("adicionar-imagem-hotel-btn");

    let destinoCount = 0;
    let imagemCount = 0;

    // Função para adicionar destino
    const adicionarDestino = () => {
        if (destinoCount >= 20) return;
        destinoCount++;
        const div = document.createElement("div");
        div.className = "destino-bloco";
        div.innerHTML = `
            <h3>Destino ${destinoCount}</h3>
            <label>Nome:</label>
            <input type="text" class="destino-nome">
            <label>Passeios:</label>
            <textarea class="destino-passeios" rows="3"></textarea>
            <label>Dicas:</label>
            <textarea class="destino-dicas" rows="2"></textarea>
            <button type="button" class="remover-destino">Remover</button>
        `;
        multidestinosContainer.appendChild(div);

        div.querySelector(".remover-destino").onclick = () => {
            div.remove();
            destinoCount--;
        };
    };

    adicionarDestinoBtn.onclick = adicionarDestino;

    // Função para adicionar imagens hotel
    const adicionarImagem = () => {
        if (imagemCount >= 8) return;
        imagemCount++;
        const div = document.createElement("div");
        div.className = "carrossel-item";
        div.innerHTML = `
            <h4>Imagem ${imagemCount}</h4>
            <input type="text" class="carrossel-imagem" placeholder="URL da imagem">
            <button type="button" class="remover-imagem">Remover</button>
        `;
        carrosselContainer.appendChild(div);

        div.querySelector(".remover-imagem").onclick = () => {
            div.remove();
            imagemCount--;
        };
    };

    adicionarImagemBtn.onclick = adicionarImagem;

    // Form submit
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

        // Carrossel imagens hotel
        document.querySelectorAll(".carrossel-imagem").forEach(input => {
            if (input.value.trim()) dados.carrosselImagensHotel.push(input.value.trim());
        });

        // Destinos múltiplos
        multidestinosContainer.querySelectorAll(".destino-bloco").forEach((div, i) => {
            const nome = div.querySelector(".destino-nome")?.value.trim() || "";
            const passeios = div.querySelector(".destino-passeios")?.value.trim() || "";
            const dicas = div.querySelector(".destino-dicas")?.value.trim() || "";
            if (nome || passeios || dicas) dados.destinosMultiplos.push({ index: i+1, nome, passeios, dicas });
        });

        try {
            const id = await salvarProposta(dados);
            window.location.href = `proposta.html?id=${id}`;
        } catch (err) {
            console.error(err);
            alert("Erro ao gerar proposta. Tente novamente.");
        }
    });

    // Limpar formulário
    document.getElementById("limparFormularioBtn")?.addEventListener("click", () => {
        form.reset();
        multidestinosContainer.innerHTML = "";
        carrosselContainer.innerHTML = "";
        destinoCount = 0;
        imagemCount = 0;
    });
});
