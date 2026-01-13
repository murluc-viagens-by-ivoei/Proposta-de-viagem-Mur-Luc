import { salvarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCotacao");
  if (!form) return;

  /* =========================
     CARROSSEL HOTEL
  ========================= */
  const hotelContainer = document.getElementById("carrossel-hotel-container");
  const addHotelImgBtn = document.getElementById("adicionar-imagem-hotel-btn");
  const maxHotelImages = 8;

  function atualizarTextoHotel() {
    const total = hotelContainer.querySelectorAll(".carrossel-item").length;
    addHotelImgBtn.textContent = `+ Adicionar imagem (${total}/${maxHotelImages})`;
    addHotelImgBtn.disabled = total >= maxHotelImages;
  }

  addHotelImgBtn.addEventListener("click", () => {
    const total = hotelContainer.querySelectorAll(".carrossel-item").length;
    if (total >= maxHotelImages) return;

    const div = document.createElement("div");
    div.className = "carrossel-item";
    div.innerHTML = `
      <h4>Imagem ${total + 1}</h4>
      <input type="text" class="carrossel-imagem" placeholder="URL da imagem">
      <button type="button" class="remover-imagem">Remover</button>
    `;

    div.querySelector(".remover-imagem").onclick = () => {
      div.remove();
      atualizarTextoHotel();
    };

    hotelContainer.appendChild(div);
    atualizarTextoHotel();
  });

  atualizarTextoHotel();

  /* =========================
     MULTIDESTINOS
  ========================= */
  const destinosContainer = document.getElementById("multidestinos-container");
  const adicionarDestinoBtn = document.getElementById("adicionar-destino-btn");

  function criarDestino(index) {
    const div = document.createElement("div");
    div.className = "destino-item";

    div.innerHTML = `
      <h3>Destino ${index}</h3>

      <label>Nome do destino</label>
      <input type="text" class="destino-nome">

      <label>Passeios</label>
      <textarea class="destino-passeios"></textarea>

      <label>Dicas</label>
      <textarea class="destino-dicas"></textarea>

      <h4>Imagens do destino</h4>
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
      input.className = "destino-imagem-url";
      input.placeholder = "URL da imagem";
      imagensContainer.appendChild(input);
    };

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

  adicionarDestinoBtn.onclick = () => {
    const total = destinosContainer.querySelectorAll(".destino-item").length;
    destinosContainer.appendChild(criarDestino(total + 1));
    atualizarTextoDestinos();
  };

  atualizarTextoDestinos();

  /* =========================
     SUBMIT
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const carrosselHotel = [];
    hotelContainer.querySelectorAll(".carrossel-imagem").forEach(i => {
      if (i.value.trim()) carrosselHotel.push(i.value.trim());
    });

    const dados = {
      destino: destino.value,
      mesAno: mesAno.value,
      chegada: chegada.value,
      traslado: traslado.value,

      foto01: foto01.value,
      foto02: foto02.value,
      foto03: foto03.value,

      tituloHospedagemCampo: tituloHospedagemCampo.value,
      hotelCheckinCampo: hotelCheckinCampo.value,
      hotelCheckoutCampo: hotelCheckoutCampo.value,
      enderecoCampo: enderecoCampo.value,
      descricaoCampo: descricaoCampo.value,
      hotelServicosCampo: hotelServicosCampo.value,
      dicasCampo: dicasCampo.value,

      carrosselImagensHotel: carrosselHotel,
      destinosMultiplos: []
    };

    destinosContainer.querySelectorAll(".destino-item").forEach(div => {
      const imgs = [];
      div.querySelectorAll(".destino-imagem-url").forEach(i => {
        if (i.value.trim()) imgs.push(i.value.trim());
      });

      dados.destinosMultiplos.push({
        nome: div.querySelector(".destino-nome").value,
        passeios: div.querySelector(".destino-passeios").value,
        dicas: div.querySelector(".destino-dicas").value,
        carrosselImagensDestino: imgs
      });
    });

    const id = await salvarProposta(dados);
    window.location.href = `proposta.html?id=${id}`;
  });
});
