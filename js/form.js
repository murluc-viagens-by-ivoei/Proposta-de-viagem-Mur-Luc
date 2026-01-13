// form.js
import { salvarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCotacao");
    if (!form) return;

    // =========================
    // IMAGENS DO HOTEL
    // =========================
    const hotelImagensContainer = document.getElementById("hotel-imagens");
    const addHotelImgBtn = document.getElementById("add-img-hotel");

    if (hotelImagensContainer && addHotelImgBtn) {
        addHotelImgBtn.onclick = () => {
            if (hotelImagensContainer.children.length >= 6) return;

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "URL da imagem do hotel";
            input.className = "hotel-imagem-url";

            hotelImagensContainer.appendChild(input);
        };
    }

    // =========================
    // MULTIDESTINOS
    // =========================
    const destinosContainer = document.getElementById("multidestinos-container");
    const adicionarDestinoBtn = document.getElementById("adicionar-destino-btn");

    function criarDestino(index) {
        const div = document.createElement("div");
        div.className = "destino-item";
        div.dataset.index = index;

        div.innerHTML = `
            <h3>Destino ${index}</h3>

            <label>Nome do destino</label>
            <input type="text" class="destino-nome">

            <label>Passeios</label>
            <textarea class="destino-passeios" rows="3"></textarea>

            <label>Dicas</label>
            <textarea class="destino-dicas" rows="3"></textarea>

            <h4>Imagens do destino (URLs)</h4>
            <div class="destino-imagens"></div>

            <button type="button" class="add-img-destino">+ Adicionar imagem</button>
            <button type="button" class="remover-destino">Remover destino</button>
            <hr>
        `;

        const imagensContainer = div.querySelector(".destino-imagens");

        div.querySelector(".add-img-destino").onclick = () => {
            if (imagensContainer.children.length >= 6) return;

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "URL da imagem";
            input.className = "destino-imagem-url";

            imagensContainer.appendChild(input);
        };

        div.querySelector(".remover-destino").onclick = () => {
            div.remove();
            atualizarTexto();
        };

        return div;
    }

    function atualizarTexto() {
        const total = destinosContainer.querySelectorAll(".destino-item").length;
        adicionarDestinoBtn.textContent = `+ Adicionar novo destino (${total}/20)`;
        adicionarDestinoBtn.disabled = total >= 20;
    }

    adicionarDestinoBtn.addEventListener("click", () => {
        const total = destinosContainer.querySelectorAll(".destino-item").length;
        if (total >= 20) return;

        destinosContainer.appendChild(criarDestino(total + 1));
        atualizarTexto();
    });

    atualizarTexto();

    // =========================
    // SUBMIT
    // =========================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // ----- IMAGENS DO HOTEL -----
        const imagensHotel = [];
        document.querySelectorAll(".hotel-imagem-url").forEach(input => {
            if (input.value.trim()) imagensHotel.push(input.value.trim());
        });

        const dados = {
            destino: document.getElementById("destino")?.value || "",
            mesAno: document.getElementById("mesAno")?.value || "",
            chegada: document.getElementById("chegada")?.value || "",
            traslado: document.getElementById("traslado")?.value || "",

            foto01: document.getElementById("foto01")?.value || "",
            foto02: document.getElementById("foto02")?.value || "",
            foto03: document.getElementById("foto03")?.value || "",

            tituloHospedagemCampo: document.getElementById("tituloHospedagemCampo")?.value || "",
            hotelCheckinCampo: document.getElementById("hotelCheckinCampo")?.value || "",
            hotelCheckoutCampo: document.getElementById("hotelCheckoutCampo")?.value || "",
            enderecoCampo: document.getElementById("enderecoCampo")?.value || "",
            descricaoCampo: document.getElementById("descricaoCampo")?.value || "",
            hotelServicosCampo: document.getElementById("hotelServicosCampo")?.value || "",
            dicasCampo: document.getElementById("dicasCampo")?.value || "",

            valorHotel: document.getElementById("valorHotel")?.value || 0,
            valorAereo: document.getElementById("valorAereo")?.value || 0,
            valorTraslado: document.getElementById("valorTraslado")?.value || 0,
            valorSeguro: document.getElementById("valorSeguro")?.value || 0,

            // 🔑 CARROSSEL DO HOTEL
            carrosselImagensHotel: imagensHotel,

            // 🔑 MULTIDESTINOS
            destinosMultiplos: []
        };

        destinosContainer.querySelectorAll(".destino-item").forEach((div, i) => {
            const imagens = [];
            div.querySelectorAll(".destino-imagem-url").forEach(input => {
                if (input.value.trim()) imagens.push(input.value.trim());
            });

            dados.destinosMultiplos.push({
                index: i + 1,
                nome: div.querySelector(".destino-nome")?.value || "",
                passeios: div.querySelector(".destino-passeios")?.value || "",
                dicas: div.querySelector(".destino-dicas")?.value || "",
                carrosselImagensDestino: imagens
            });
        });

        try {
            const id = await salvarProposta(dados);
            window.location.href = `proposta.html?id=${id}`;
        } catch (err) {
            console.error(err);
            alert("Erro ao gerar proposta");
        }
    });
});
