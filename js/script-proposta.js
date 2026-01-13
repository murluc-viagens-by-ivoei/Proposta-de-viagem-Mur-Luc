// script-proposta.js
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
  // HELPERS
  // ===============================
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
  };

  const setImg = (id, url) => {
    const img = document.getElementById(id);
    if (!img) return;
    if (url) {
      img.src = url;
      img.style.display = "block";
    } else {
      img.style.display = "none";
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
  let currentHotel = 0;
  const hotelImages = (dados.carrosselImagensHotel || []).filter(Boolean);

  const hotelBox = document.getElementById("carrossel-images-hotel");
  const hotelDots = document.getElementById("carrossel-dots-hotel");
  const hotelCounter = document.getElementById("carrossel-counter-hotel");

  function renderHotel() {
    if (!hotelBox || hotelImages.length === 0) return;

    hotelBox.innerHTML = "";
    hotelDots.innerHTML = "";

    hotelImages.forEach((url, i) => {
      const img = document.createElement("img");
      img.src = url;
      img.className = "carrossel-image" + (i === currentHotel ? " active" : "");
      hotelBox.appendChild(img);

      const dot = document.createElement("span");
      dot.className = "carrossel-dot" + (i === currentHotel ? " active" : "");
      dot.onclick = () => {
        currentHotel = i;
        renderHotel();
      };
      hotelDots.appendChild(dot);
    });

    hotelCounter.textContent = `${currentHotel + 1} / ${hotelImages.length}`;
  }

  window.prevSlideHotel = () => {
    currentHotel =
      (currentHotel - 1 + hotelImages.length) % hotelImages.length;
    renderHotel();
  };

  window.nextSlideHotel = () => {
    currentHotel = (currentHotel + 1) % hotelImages.length;
    renderHotel();
  };

  renderHotel();

  // ===============================
  // MULTIDESTINOS
  // ===============================
  const destinosContainer = document.getElementById("destinos-container");
  if (!destinosContainer) return;

  (dados.destinosMultiplos || []).forEach((destino, index) => {
    const page = document.createElement("div");
    page.className = "page destino-pagina";

    page.innerHTML = `
      <img src="./assets/logo.png" class="logo">
      <h1 class="destino-nome-titulo">
        Destino ${index + 1}: ${destino.nome || ""}
      </h1>

      <div class="bloco">
        <h2>Passeios</h2>
        <p>${destino.passeios || ""}</p>
      </div>
    `;

    // === CARROSSEL DO DESTINO ===
    if (destino.imagens && destino.imagens.length > 0) {
      const imagens = destino.imagens.filter(Boolean);
      let current = 0;

      const carrossel = document.createElement("div");
      carrossel.className = "destino-carrossel carrossel";

      const imgs = document.createElement("div");
      imgs.className = "carrossel-images";

      const dots = document.createElement("div");
      dots.className = "carrossel-dots";

      const counter = document.createElement("div");
      counter.className = "carrossel-counter";

      function renderDestino() {
        imgs.innerHTML = "";
        dots.innerHTML = "";

        imagens.forEach((url, i) => {
          const img = document.createElement("img");
          img.src = url;
          img.className =
            "carrossel-image" + (i === current ? " active" : "");
          imgs.appendChild(img);

          const dot = document.createElement("span");
          dot.className =
            "carrossel-dot" + (i === current ? " active" : "");
          dot.onclick = () => {
            current = i;
            renderDestino();
          };
          dots.appendChild(dot);
        });

        counter.textContent = `${current + 1} / ${imagens.length}`;
      }

      const controls = document.createElement("div");
      controls.className = "carrossel-controls";

      const prev = document.createElement("button");
      prev.className = "carrossel-prev";
      prev.textContent = "❮";
      prev.onclick = () => {
        current = (current - 1 + imagens.length) % imagens.length;
        renderDestino();
      };

      const next = document.createElement("button");
      next.className = "carrossel-next";
      next.textContent = "❯";
      next.onclick = () => {
        current = (current + 1) % imagens.length;
        renderDestino();
      };

      controls.append(prev, dots, next);
      carrossel.append(imgs, controls, counter);
      page.appendChild(carrossel);

      renderDestino();
    }

    // === DICAS ===
    const dicas = document.createElement("div");
    dicas.className = "bloco";
    dicas.innerHTML = `
      <h2>Dicas</h2>
      <p>${destino.dicas || ""}</p>
    `;
    page.appendChild(dicas);

    // === RODAPÉ ===
    const rodape = document.createElement("div");
    rodape.className = "rodape";
    rodape.innerHTML = `<img src="./assets/rodape.png">`;
    page.appendChild(rodape);

    destinosContainer.appendChild(page);
  });

  console.log("✅ script-proposta carregado corretamente");
});
