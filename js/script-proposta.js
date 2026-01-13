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
  // HELPERS
  // ===============================
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value ?? "";
  };


  const setImg = (id, url) => {
    const img = document.getElementById(id);
    if (img && url) {
      img.src = url;
      img.style.display = "block";
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
  setText("dicasCampo", dados.dicasCampo);

  // ===============================
  // CARROSSEL DO HOTEL
  // ===============================
  let currentIndexHotel = 0;
  const hotelImages = (dados.carrosselImagensHotel || []).filter(Boolean);

  const hotelContainer = document.getElementById("carrossel-images-hotel");
  const hotelDots = document.getElementById("carrossel-dots-hotel");
  const hotelCounter = document.getElementById("carrossel-counter-hotel");

  function renderCarouselHotel() {
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
        renderCarouselHotel();
      };
      hotelDots.appendChild(dot);
    });

    hotelCounter.textContent = `${currentIndexHotel + 1} / ${hotelImages.length}`;
  }

  window.prevSlideHotel = () => {
    currentIndexHotel = (currentIndexHotel - 1 + hotelImages.length) % hotelImages.length;
    renderCarouselHotel();
  };

  window.nextSlideHotel = () => {
    currentIndexHotel = (currentIndexHotel + 1) % hotelImages.length;
    renderCarouselHotel();
  };

  renderCarouselHotel();

  // ===============================
  // MULTIPLOS DESTINOS (OPÇÃO 2)
  // ===============================
  const destinosContainer = document.getElementById("destinos-container");

  if (dados.destinosMultiplos && dados.destinosMultiplos.length > 0) {
    dados.destinosMultiplos.forEach((destino, index) => {
      criarDestinoCard(destino, index);
    });
  }

  function criarDestinoCard(destino, index) {
    const div = document.createElement("div");
    div.className = "page destino-pagina";

    div.innerHTML = `
            <img src="./assets/logo.png" class="logo" alt="Logo">


            <h1 class="destino-nome-titulo">
                Destino ${index + 1}: ${destino.nome || ""}
            </h1>

            <div class="bloco">
                <h2>Passeios</h2>
                <p>${destino.passeios || ""}</p>
            </div>
        `;

    // ===== CARROSSEL DE IMAGENS DO DESTINO =====
    if (destino.imagens && destino.imagens.length > 0) {

      const imagensDestino = destino.imagens.filter(Boolean);
      let currentIndexDestino = 0;

      const carouselDiv = document.createElement("div");
      carouselDiv.className = "destino-carrossel carrossel";

      const imagesWrapper = document.createElement("div");
      imagesWrapper.className = "carrossel-images";

      const dotsWrapper = document.createElement("div");
      dotsWrapper.className = "carrossel-dots";

      const counter = document.createElement("div");
      counter.className = "carrossel-counter";

      function renderDestinoCarousel() {
        imagesWrapper.innerHTML = "";
        dotsWrapper.innerHTML = "";

        imagensDestino.forEach((url, i) => {
          const img = document.createElement("img");
          img.src = url;
          img.className = "carrossel-image" + (i === currentIndexDestino ? " active" : "");
          imagesWrapper.appendChild(img);

          const dot = document.createElement("span");
          dot.className = "carrossel-dot" + (i === currentIndexDestino ? " active" : "");
          dot.onclick = () => {
            currentIndexDestino = i;
            renderDestinoCarousel();
          };
          dotsWrapper.appendChild(dot);
        });

        counter.textContent = `${currentIndexDestino + 1} / ${imagensDestino.length}`;
      }

      const prevBtn = document.createElement("button");
      prevBtn.className = "carrossel-prev";
      prevBtn.innerText = "❮";
      prevBtn.onclick = () => {
        currentIndexDestino =
          (currentIndexDestino - 1 + imagensDestino.length) % imagensDestino.length;
        renderDestinoCarousel();
      };

      const nextBtn = document.createElement("button");
      nextBtn.className = "carrossel-next";
      nextBtn.innerText = "❯";
      nextBtn.onclick = () => {
        currentIndexDestino =
          (currentIndexDestino + 1) % imagensDestino.length;
        renderDestinoCarousel();
      };

      const controls = document.createElement("div");
      controls.className = "carrossel-controls";
      controls.appendChild(prevBtn);
      controls.appendChild(dotsWrapper);
      controls.appendChild(nextBtn);

      carouselDiv.appendChild(imagesWrapper);
      carouselDiv.appendChild(controls);
      carouselDiv.appendChild(counter);

      div.appendChild(carouselDiv);
      renderDestinoCarousel();
    }

    // ===== DICAS =====
    const dicasBloco = document.createElement("div");
    dicasBloco.className = "bloco";
    dicasBloco.innerHTML = `
            <h2>Dicas</h2>
            <p>${destino.dicas || ""}</p>
        `;
    div.appendChild(dicasBloco);

    // ===== RODAPÉ =====
    const rodape = document.createElement("div");
    rodape.className = "rodape";
    rodape.innerHTML = `
            <img src="./assets/rodape.png" alt="Rodapé">
        `;
    div.appendChild(rodape);

    destinosContainer.appendChild(div);
  }

  // ===============================
  // VALORES
  // ===============================
  const itemsList = document.getElementById("itemsList");
  if (itemsList) {
    const valores = [
      { label: "Hotel", value: dados.valorHotel },
      { label: "Passagem Aérea", value: dados.valorAereo },
      { label: "Traslado", value: dados.valorTraslado },
      { label: "Seguro Viagem", value: dados.valorSeguro }
    ];

    itemsList.innerHTML = "";
    valores.forEach(item => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
                <span class="label">${item.label}</span>
                <span class="dots"></span>
                <span class="price">R$ ${item.value || 0}</span>
            `;
      itemsList.appendChild(row);
    });

    const total = valores.reduce((acc, cur) => acc + Number(cur.value || 0), 0);
    const totalRow = document.createElement("div");
    totalRow.className = "row total";
    totalRow.innerHTML = `
            <span class="label">TOTAL</span>
            <span class="dots"></span>
            <span class="price">R$ ${total}</span>
        `;
    itemsList.appendChild(totalRow);
  }


  console.log("✅ Proposta renderizada com sucesso");
});
